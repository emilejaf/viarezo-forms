import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { FormUtilityService } from 'src/abstract-forms/form-utility.service';
import { PapsDto } from 'src/paps/dto/paps.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LEGACY_PAPS_CHOICE_ID, Paps } from './entities/paps.entity';
import { PapsAnswerDto } from './dto/paps-answer.dto';
import { PapsAnswer } from './entities/paps-answer.entity';
import { AccessService } from 'src/access/access.service';
import { AccessType } from 'src/access/access';

@Injectable()
export class PapsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly formUtility: FormUtilityService,
    @Inject(forwardRef(() => AccessService))
    private readonly accessService: AccessService,
  ) {}

  async create(login: string) {
    const id = await this.formUtility.generateUniqueFormId();

    const databaseForm = await this.prisma.form.create({
      data: {
        id,
        login,
        title: 'PAPS sans titre',
        access: AccessType.CS,
        active: true,
        paps: true,
        secured: false,
        papsChoices: {
          create: [
            {
              name: 'PAPS',
              size: 10,
            },
          ],
        },
      },
    });

    const paps = new Paps(databaseForm);

    await this.accessService.createAction(paps);

    return paps;
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
        papsChoices: true,
      },
    });

    if (!databaseForm) return null;

    // fetch answers count for each choice
    if (databaseForm.papsChoices.length > 0) {
      const counts = await this.prisma.$transaction(
        databaseForm.papsChoices.map((choice) =>
          this.prisma.answer.count({
            where: {
              formId: id,
              papsChoiceId: choice.id,
            },
          }),
        ),
      );

      return new Paps(
        databaseForm,
        undefined,
        databaseForm.papsChoices.map((choice, index) => {
          return {
            ...choice,
            answersCount: counts[index],
          };
        }),
      );
    } else {
      // legacy code, only one choice
      const count = await this.prisma.answer.count({
        where: {
          formId: id,
        },
      });

      const papsChoices = databaseForm.papsSize
        ? [
            {
              id: LEGACY_PAPS_CHOICE_ID,
              size: databaseForm.papsSize,
              answersCount: count,
            },
          ]
        : [];

      // -1 is the id of the only choice
      return new Paps(databaseForm, undefined, papsChoices);
    }
  }

  async update(id: string, updatePapsDto: PapsDto) {
    const databaseForm = await this.prisma.form.update({
      where: { id },
      data: {
        ...updatePapsDto.toPlain(),
        fields: updatePapsDto.buildPrimaFields(id),
        papsChoices: updatePapsDto.buildPrismaPapsChoices(id),
      },
    });

    const paps = new Paps(databaseForm);

    await this.accessService.updateAction(paps);

    return paps;
  }

  remove(id: string) {
    return this.formUtility.remove(id);
  }

  async isPapsChoiceValid(id: string, choiceId: number) {
    if (choiceId == LEGACY_PAPS_CHOICE_ID) return true;

    const databaseChoice = await this.prisma.papsChoice.findUnique({
      where: {
        id: choiceId,
      },
      select: {
        papsId: true,
      },
    });

    if (!databaseChoice) return false;

    return databaseChoice.papsId === id;
  }

  async createAnswer(
    id: string,
    answerDto: PapsAnswerDto,
    by?: string,
    fullname?: string,
  ) {
    const databaseAnswer = await this.prisma.answer.create({
      data: {
        formId: id,
        by: by,
        fullname: fullname,
        data: answerDto.toPrisma(),
        papsChoiceId: answerDto.choiceId >= 0 ? answerDto.choiceId : undefined,
      },
    });

    return new PapsAnswer(databaseAnswer);
  }

  async findAllAnswers(id: string) {
    const databaseAnswers = await this.prisma.answer.findMany({
      where: { formId: id },
      orderBy: {
        id: 'asc',
      },
    });

    return databaseAnswers.map(
      (databaseAnswer) => new PapsAnswer(databaseAnswer),
    );
  }

  async findAnswer(id: string, login: string) {
    const databaseAnswer = await this.prisma.answer.findFirst({
      where: {
        formId: id,
        by: login,
      },
    });

    if (!databaseAnswer) return null;

    const answer = new PapsAnswer(databaseAnswer);

    if (!answer) return null;

    const position = await this.prisma.answer.count({
      where: {
        formId: id,
        papsChoiceId:
          answer.papsChoiceId >= 0 ? answer.papsChoiceId : undefined,
        id: {
          lt: answer.id,
        },
      },
    });

    return { position, answer };
  }

  removeAnswer(id: string, login: string) {
    return this.prisma.answer.deleteMany({
      where: {
        formId: id,
        by: login,
        lastScan: null,
      },
    });
  }

  async hasAnswered(id: string, login: string) {
    const databaseAnswer = await this.prisma.answer.findFirst({
      where: {
        formId: id,
        by: login,
      },
    });

    return !!databaseAnswer;
  }

  async checkAccess(id: string, login: string): Promise<boolean> {
    const answer = await this.findAnswer(id, login);
    const paps = await this.findOne(id);

    const choice = paps?.choices.find(
      (c) => c.id === answer?.answer.papsChoiceId,
    );

    if (
      !answer ||
      !choice ||
      answer.position >= choice.size ||
      answer.answer.lastScan
    ) {
      return false;
    }

    await this.prisma.answer.update({
      where: {
        id: answer.answer.id,
      },
      data: {
        lastScan: new Date(),
      },
    });

    return true;
  }
}
