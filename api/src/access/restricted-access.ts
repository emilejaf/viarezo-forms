import { PrismaService } from 'src/prisma/prisma.service';
import { Access } from './access';
import { User } from 'src/auth/entities/user.entity';
import { AbstractForm } from '../abstract-forms/entities/form.entity';

export class RestrictedAccess extends Access {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  public async authorize(request: any) {
    const user: User | undefined = request.user;
    const formId: string = request.params.formId || request.params.id;
    // meta is the form id

    if (!user) return false;

    const allowed = await this.prismaService.canAnswer.findUnique({
      where: {
        userId_formId: {
          formId: formId,
          userId: user.login,
        },
      },
    });

    return !!allowed;
  }

  async createAction(form: AbstractForm) {
    await this.action(form);
  }

  async updateAction(form: AbstractForm) {
    await this.prismaService.$transaction([
      this.prismaService.canAnswer.deleteMany({
        where: {
          formId: form.id,
        },
      }),
      this.action(form),
    ]);
  }

  private action(form: AbstractForm) {
    const accessMeta =
      'accessMeta' in form ? (form.accessMeta as string) : undefined;

    const logins: string[] = accessMeta ? JSON.parse(accessMeta as string) : [];

    return this.prismaService.canAnswer.createMany({
      data: logins.map((login) => ({
        formId: form.id,
        userId: login,
      })),
    });
  }
}
