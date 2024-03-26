import { Injectable } from '@nestjs/common';
import { User } from './auth/entities/user.entity';
import { PrismaService } from './prisma/prisma.service';
import { AbstractAnswer } from './abstract-forms/entities/answer.entity';
import { AbstractForm, FormType } from './abstract-forms/entities/form.entity';
import { Answer as PrismaAnswer } from '@prisma/client';
import { FormAnswer } from './forms/entities/form-answer.entity';
import { PapsAnswer } from './paps/entities/paps-answer.entity';
import { VoteAnswer } from './votes/entities/vote-answer.entity';
import { FormUtilityService } from './abstract-forms/form-utility.service';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly formUtility: FormUtilityService,
  ) {}

  async findAllAnswers(
    user: User,
  ): Promise<(AbstractAnswer & { form: AbstractForm })[]> {
    const prismaAnswers = await this.prisma.answer.findMany({
      where: {
        by: user.login,
      },
      include: {
        form: true,
      },
    });

    return prismaAnswers.map((prismaAnswer) => {
      const form = this.formUtility.formBuilder(prismaAnswer.form);
      const answer = this.buildAnswer(form.type, prismaAnswer);
      return { ...answer, form };
    });
  }

  private buildAnswer(type: FormType, prismaAnswer: PrismaAnswer) {
    switch (type) {
      case FormType.PAPS:
        return new PapsAnswer(prismaAnswer);
      case FormType.VOTE:
        return new VoteAnswer(prismaAnswer);
      case FormType.FORM:
        return new FormAnswer(prismaAnswer);
    }
  }
}
