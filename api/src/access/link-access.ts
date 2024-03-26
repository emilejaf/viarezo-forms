import { PrismaService } from 'src/prisma/prisma.service';
import { Access } from './access';
import { UnauthorizedException } from '@nestjs/common';
import { AbstractForm } from 'src/abstract-forms/entities/form.entity';
import { randomUUID } from 'crypto';
import { MailingService } from 'src/mailing/mailing.service';

export class LinkAccess extends Access {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailingService: MailingService,
  ) {
    super();
  }

  public async authorize(request: any) {
    const key: string = request.query.key;
    const formId: string = request.params.formId || request.params.id;

    const active_link = await this.prismaService.uniqueLink.findUnique({
      where: {
        key: key,
        formId: formId,
      },
      select: {
        active: true,
      },
    });

    if (!active_link) return false;

    if (active_link.active) {
      return true;
    } else {
      throw new UnauthorizedException(
        'This link has already been used or is no longer valid.',
      );
    }
  }

  public async createAction(form: AbstractForm) {
    const accessMeta =
      'accessMeta' in form ? (form.accessMeta as string) : undefined;

    const emails: string[] = accessMeta ? JSON.parse(accessMeta) : [];

    await this.createLinks(form, emails);
  }

  public async updateAction(form: AbstractForm) {
    const accessMeta =
      'accessMeta' in form ? (form.accessMeta as string) : undefined;

    const emails: string[] = accessMeta ? JSON.parse(accessMeta) : [];

    const oldEmailsData = await this.prismaService.uniqueLink.findMany({
      where: {
        formId: form.id,
      },
      select: {
        name: true,
      },
    });

    if (!oldEmailsData) throw new Error('Form not found');

    const oldEmails = oldEmailsData.map((email) => email.name);

    const emailsToAdd = emails.filter((email) => !oldEmails.includes(email));
    const emailsToRemove = oldEmails.filter(
      (email) => email && !emails.includes(email),
    ) as string[];

    await this.prismaService.uniqueLink.deleteMany({
      where: {
        formId: form.id,
        name: {
          in: emailsToRemove,
        },
      },
    });

    await this.createLinks(form, emailsToAdd);
  }

  private async createLinks(form: AbstractForm, emails: string[]) {
    const data = emails.map((mail) => {
      const key = randomUUID();

      const transaction = this.prismaService.uniqueLink.create({
        data: {
          key: key,
          formId: form.id,
          active: true,
          name: mail,
        },
      });

      return {
        transaction,
        email: mail,
        key,
      };
    });

    await this.prismaService.$transaction(data.map((d) => d.transaction));

    await Promise.all(
      data.map((d) =>
        this.mailingService.sendMail(
          this.mailingService.templates.accessLink,
          d.email,
          `Invitation à répondre au formulaire : ${form.title}`,
          {
            title: form.title,
            // TODO CORRECT LINK
            link: `${process.env.FRONT_URL}/form/${form.id}/answer?key=${d.key}`,
          },
        ),
      ),
    );
  }
}
