import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EditableGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const formId: string = request.params.formId || request.params.id;

    const form = await this.prismaService.form.findUnique({
      where: {
        id: formId,
      },
    });

    if (!form) return false;

    return form.editable || form.editable === null;
  }
}
