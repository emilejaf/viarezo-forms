import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AsymetricService } from 'src/crypto/asymetric.service';
import { SymetricKey, SymetricService } from 'src/crypto/symetric.service';
import { SigningService } from 'src/crypto/signing.service';
import { VoteDto } from './dto/vote.dto';
import { FormUtilityService } from 'src/abstract-forms/form-utility.service';
import { VoteAnswerDto } from './dto/vote-answer.dto';
import { KeyLike } from 'crypto';
import { VoteAnswer } from './entities/vote-answer.entity';
import { Vote } from './entities/vote.entity';
import { AccessService } from 'src/access/access.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class VotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly abstractFormsService: FormUtilityService,
    private readonly formUtility: AccessService,
    private readonly asymetric: AsymetricService,
    private readonly symetric: SymetricService,
    private readonly signing: SigningService,
  ) {}

  async create(login: string) {
    const id = await this.abstractFormsService.generateUniqueFormId();

    const databaseForm = await this.prisma.form.create({
      data: {
        id,
        login,
        title: 'Vote sans titre',
        secured: true,
        paps: false,
        editable: true,
      },
    });

    const vote = new Vote(databaseForm);

    await this.formUtility.createAction(vote);

    return vote;
  }

  async findOne(id: string) {
    const databaseForm = await this.prisma.form.findUnique({
      where: { id },
      include: {
        fields: {
          include: {
            choices: true,
          },
        },
      },
    });

    if (!databaseForm) return null;

    return new Vote(databaseForm);
  }

  async update(id: string, updateVoteDto: VoteDto) {
    const databaseForm = await this.prisma.form.update({
      where: { id, editable: true },
      data: {
        ...updateVoteDto.toPlain(),
        fields: updateVoteDto.buildPrimaFields(id),
      },
    });

    const vote = new Vote(databaseForm);

    await this.formUtility.updateAction(vote);

    return vote;
  }

  remove(id: string) {
    return this.abstractFormsService.remove(id);
  }

  async createAnswer(
    id: string,
    answerDto: VoteAnswerDto,
    key: SymetricKey,
    keyId: number,
    userId: number,
  ) {
    const publicAdminKey = await this.getPublicAdminKey(id);

    const answerData = answerDto.toPrisma();

    const encryptedData = this.asymetric.encrypt(answerData, publicAdminKey);

    const privateVoterKey = await this.getVoterPrivateKey(keyId, key);

    const signature = this.signing.sign(encryptedData, privateVoterKey);

    const [databaseAnswer] = await this.prisma.$transaction([
      this.prisma.answer.create({
        data: {
          formId: id,
          data: encryptedData,
          signature: signature,
          cryptedBy: keyId,
        },
      }),
      this.prisma.securedFormUser.update({
        where: { id: userId },
        data: { voted: true },
      }),
    ]);

    // signature is verified here because we just created the answer
    return new VoteAnswer({ ...databaseAnswer, data: answerData }, true);
  }

  async findAllAnswers(id: string, adminKey?: SymetricKey) {
    if (!adminKey) throw new Error('Missing admin key');

    const databaseAnswers = await this.prisma.answer.findMany({
      where: {
        formId: id,
      },
      include: {
        securedFormsKeys: true,
      },
    });

    const privateAdminKey = await this.getPrivateAdminKey(id, adminKey);

    return databaseAnswers.map((databaseAnswer) => {
      const decyptedData = this.asymetric.decrypt(
        databaseAnswer.data,
        privateAdminKey,
      );

      if (!databaseAnswer.securedFormsKeys?.cryptedPublic) {
        throw new Error('Unable to find public key for this answer');
      }

      if (!databaseAnswer.signature) {
        throw new Error('Unable to find signature for this answer');
      }

      const voterPublicKey = this.symetric.decrypt(
        databaseAnswer.securedFormsKeys?.cryptedPublic,
        adminKey,
      );

      const verified = this.signing.verify(
        databaseAnswer.data,
        databaseAnswer.signature,
        voterPublicKey,
      );

      return new VoteAnswer(
        {
          ...databaseAnswer,
          data: decyptedData,
        },
        verified,
      );
    });
  }

  async generateAdminCredentials(id: string) {
    const symetricAdminKeys = this.symetric.newKey();

    const asymetricAdminKeys = await this.asymetric.newKeyPair();

    const cryptedPrivateKey = this.symetric.encrypt(
      asymetricAdminKeys.privateKey,
      symetricAdminKeys,
    );

    // using upsert enable us to recover if the smtp server is down
    await this.prisma.securedFormAdminCredentials.upsert({
      where: {
        voteId: id,
      },
      create: {
        voteId: id,
        cryptedPrivateKey: cryptedPrivateKey,
        publicKey: Buffer.from(asymetricAdminKeys.publicKey),
      },
      update: {
        cryptedPrivateKey: cryptedPrivateKey,
        publicKey: Buffer.from(asymetricAdminKeys.publicKey),
      },
    });

    return symetricAdminKeys;
  }

  private async getPublicAdminKey(id: string): Promise<KeyLike> {
    const adminCredentials =
      await this.prisma.securedFormAdminCredentials.findUnique({
        where: {
          voteId: id,
        },
        select: {
          publicKey: true,
        },
      });

    if (!adminCredentials?.publicKey) {
      throw new Error('No public key found for this vote');
    }

    return adminCredentials.publicKey;
  }

  private async getPrivateAdminKey(id: string, symetricAdminKey: SymetricKey) {
    const adminCredentials =
      await this.prisma.securedFormAdminCredentials.findUnique({
        where: {
          voteId: id,
        },
        select: {
          cryptedPrivateKey: true,
        },
      });

    if (!adminCredentials?.cryptedPrivateKey) {
      throw new Error('No private key found for this vote');
    }

    return this.symetric.decrypt(
      adminCredentials.cryptedPrivateKey,
      symetricAdminKey,
    );
  }

  async generateVotersCredentials(
    id: string,
    voters: { email: string; id: number }[],
    symetricAdminKeys: SymetricKey,
  ) {
    const result = await Promise.all(
      voters.map(async (voter) => {
        const signingVoterKeys = await this.signing.newKeyPair();

        const symetricVoterKeys = this.symetric.newKey();

        const aesChecksum = this.symetric.encrypt(
          voter.id.toString(),
          symetricVoterKeys,
        );

        const encryptedPrivateKey = this.symetric.encrypt(
          signingVoterKeys.privateKey,
          symetricVoterKeys,
        );
        const encryptedPublicKey = this.symetric.encrypt(
          signingVoterKeys.publicKey,
          symetricAdminKeys,
        );

        return {
          transaction: this.prisma.securedFormKey.create({
            data: {
              voteId: id,
              cryptedPublic: encryptedPublicKey,
              cryptedPrivate: encryptedPrivateKey,
              aesChecksum: aesChecksum,
            },
            select: {
              id: true,
            },
          }),
          voterKeys: symetricVoterKeys,
          ...voter,
        };
      }),
    );

    // to this point, only keys are generated, they are not stored in the database yet

    const prismaResult = await this.prisma.$transaction(
      result.map((payload) => payload.transaction),
    );

    return result.map((payload, index) => ({
      voterKeys: payload.voterKeys,
      email: payload.email,
      user: payload.id,
      keyId: prismaResult[index].id,
    }));
  }

  private async getVoterPrivateKey(
    keyId: number,
    symetricVoterKey: SymetricKey,
  ) {
    const formKeys = await this.prisma.securedFormKey.findUnique({
      where: {
        id: keyId,
      },
      select: {
        cryptedPrivate: true,
      },
    });

    if (!formKeys?.cryptedPrivate)
      throw new Error('No private key found for this voter');

    return this.symetric.decrypt(formKeys.cryptedPrivate, symetricVoterKey);
  }

  async startVote(id: string) {
    return await this.prisma.form.update({
      where: {
        id: id,
      },
      data: {
        editable: false,
        active: true,
      },
    });
  }

  async stopVote(id: string) {
    try {
      await this.prisma.form.update({
        where: {
          id: id,
          editable: false,
          active: true,
        },
        data: {
          active: false,
        },
      });
      return true;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) return false;
      throw error;
    }
  }
}
