import { PrismaService } from 'src/prisma/prisma.service';
import { FormAccess } from 'src/access/access';
import { SymetricKey, SymetricService } from 'src/crypto/symetric.service';

export class VotesAccess extends FormAccess {
  constructor(
    private readonly prisma: PrismaService,
    private readonly symetric: SymetricService,
  ) {
    super();
  }

  public async authorize(request: any) {
    const formId: string = request.params.formId || request.params.id;

    const voterId: number = parseInt(request.query.user);
    const asymetricKeyId: number = parseInt(request.query.id);

    const queryKey: string = request.query.key;
    const queryIV: string = request.query.iv;

    if (!queryKey || !queryIV) return false;

    const key: SymetricKey = {
      key: Buffer.from(queryKey.replaceAll(' ', '+'), 'base64'),
      iv: Buffer.from(queryIV.replaceAll(' ', '+'), 'base64'),
    };

    const securedFormKey = await this.prisma.securedFormKey.findUnique({
      where: {
        voteId: formId,
        id: asymetricKeyId,
      },
    });

    if (!securedFormKey) return false;

    if (!this.canDecyptPrivateKey(key, securedFormKey.cryptedPrivate))
      return false;

    if (!this.checkAES_Checksum(voterId, key, securedFormKey.aesChecksum))
      return false;

    const hasVoted = await this.hasVoted(voterId);

    return hasVoted == undefined ? false : !hasVoted;
  }

  public updateAction(): void | Promise<void> {}
  public createAction(): void | Promise<void> {}

  async hasVoted(voterId: number): Promise<boolean | undefined> {
    const voter = await this.prisma.securedFormUser.findUnique({
      where: {
        id: voterId,
      },
    });

    return voter?.voted;
  }

  private checkAES_Checksum(
    voterId: number,
    key: SymetricKey,
    checksum: Buffer,
  ) {
    try {
      const decryptedChecksum = this.symetric.decrypt(checksum, key);

      return decryptedChecksum == voterId.toString();
    } catch {
      return false;
    }
  }

  private canDecyptPrivateKey(key: SymetricKey, encryptedPrivateKey: Buffer) {
    try {
      this.symetric.decrypt(encryptedPrivateKey, key);
      return true;
    } catch {
      return false;
    }
  }
}
