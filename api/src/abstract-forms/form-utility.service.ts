import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Form as PrismaForm } from '@prisma/client';
import {
  AbstractForm,
  FormType,
  PrismaFormWithFields,
} from './entities/form.entity';
import { User } from '../auth/entities/user.entity';
import { Form } from 'src/forms/entities/form.entity';
import { Paps } from '../paps/entities/paps.entity';
import { Vote } from '../votes/entities/vote.entity';
import { AbstractField } from './entities/field.entity';
import { AbstractAnswerDto } from './dto/answer.dto';
import { LinkCSService } from 'src/viarezo/linkcs.service';

type DatabaseForm = PrismaForm | PrismaFormWithFields;

@Injectable()
export class FormUtilityService {
  private forms = {
    [FormType.FORM]: Form,
    [FormType.PAPS]: Paps,
    [FormType.VOTE]: Vote,
  };

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly linkcsService: LinkCSService,
  ) {}

  public async generateUniqueFormId(): Promise<string> {
    let id = '';
    let isUnique = false;
    while (!isUnique) {
      id = Math.random().toString(36).substring(2, 8);
      isUnique = !(await this.prisma.form.findUnique({ where: { id } }));
    }
    return id;
  }

  async findAll(user: User): Promise<AbstractForm[]> {
    return (
      await this.prisma.form.findMany({
        where: {
          login: user.login,
        },
      })
    ).map((form) => this.formBuilder(form, null));
  }

  async findAllModerated(user: User): Promise<AbstractForm[]> {
    const forms = await this.prisma.form.findMany({
      where: {
        moderators: {
          some: {
            moderatorLogin: user.login,
          },
        },
      },
    });

    const formsWithOwner = await Promise.all(
      forms.map(async (form) => {
        const owner = await this.getOwner(form, user);
        return this.formBuilder(form, owner);
      }),
    );

    return formsWithOwner;
  }

  async getFormWithoutNestedFields(id: string) {
    const databaseForm = await this.prisma.form.findUnique({
      where: { id },
    });

    if (!databaseForm) return null;

    const form = this.formBuilder(databaseForm);

    return form;
  }

  async getFormOwner(id: string) {
    const owner = await this.prisma.form.findUnique({
      where: { id },
      select: {
        login: true,
      },
    });

    return owner?.login;
  }

  async validateAnswer(
    answerDto: AbstractAnswerDto,
    form: { fields: AbstractField[] } | { formId: string },
  ) {
    const fields =
      'fields' in form
        ? form.fields
        : (
            await this.prisma.field.findMany({
              where: {
                formId: form.formId,
              },
              include: {
                choices: true,
              },
            })
          ).map((field) => AbstractField.New(field));

    return await answerDto.validateRequiredFields(fields);
  }

  async remove(id: string): Promise<AbstractForm> {
    return this.formBuilder(
      await this.prisma.form.delete({
        where: { id },
        include: {
          fields: {
            include: {
              choices: true,
            },
          },
        },
      }),
    );
  }

  public getFormType(form: PrismaForm): FormType {
    if (form.paps) {
      return FormType.PAPS;
    } else if (form.secured) {
      return FormType.VOTE;
    }
    return FormType.FORM;
  }

  private async getOwner(
    form: DatabaseForm,
    user: User,
  ): Promise<string | null> {
    if (form.login === user.login) {
      return null;
    } else {
      const owner = await this.linkcsService.getUsersByLogin(
        [form.login],
        user.accessToken,
      );

      return owner[0].firstName + ' ' + owner[0].lastName;
    }
  }

  // using function overloads, we let typescript know that if form is a NestedForm, then the return type is AbstractForm
  public formBuilder(form: DatabaseForm, owner?: string | null): AbstractForm;
  public formBuilder(
    form: DatabaseForm | null,
    owner?: string | null,
  ): AbstractForm | null;
  public formBuilder(
    form: DatabaseForm | null,
    owner?: string | null,
  ): AbstractForm | null {
    if (!form) return null;

    const type = this.getFormType(form);

    return new this.forms[type](form, owner);
  }
}
