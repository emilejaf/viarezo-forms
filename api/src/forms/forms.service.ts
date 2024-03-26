import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { FormDto } from './dto/form.dto';
import { Form } from './entities/form.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { FormUtilityService } from 'src/abstract-forms/form-utility.service';
import { AbstractAnswer } from 'src/abstract-forms/entities/answer.entity';
import { FormAnswerDto } from './dto/form-answer.dto';
import { FormAnswer } from './entities/form-answer.entity';
import { AccessService } from 'src/access/access.service';
import { AccessType } from 'src/access/access';

@Injectable()
export class FormsService {
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
        title: 'Formulaire sans titre',
        access: AccessType.ALL,
        active: true,
        paps: false,
        secured: false,
      },
    });

    const baseForm = new Form(databaseForm);

    await this.accessService.createAction(baseForm);

    return baseForm;
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

    return new Form(databaseForm);
  }

  async update(id: string, updateFormDto: FormDto) {
    const databaseForm = await this.prisma.form.update({
      where: { id },
      data: {
        ...updateFormDto.toPlain(),
        fields: updateFormDto.buildPrimaFields(id),
      },
    });

    const form = new Form(databaseForm);

    await this.accessService.updateAction(form);

    return form;
  }

  remove(id: string) {
    return this.formUtility.remove(id);
  }

  async createAnswer(
    id: string,
    answerDto: FormAnswerDto,
    by?: string,
    fullname?: string,
  ) {
    const databaseAnswer = await this.prisma.answer.create({
      data: {
        formId: id,
        data: answerDto.toPrisma(),
        by: by,
        fullname: fullname,
      },
    });

    return new FormAnswer(databaseAnswer);
  }

  async findAllAnswers(id: string): Promise<AbstractAnswer[]> {
    const databaseAnswers = await this.prisma.answer.findMany({
      where: { formId: id },
    });

    return databaseAnswers.map((databaseAnswer) => {
      return new FormAnswer(databaseAnswer);
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
}
