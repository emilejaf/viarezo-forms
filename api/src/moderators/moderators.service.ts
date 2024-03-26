import { Injectable } from '@nestjs/common';
import { UpdateModeratorDto } from './dto/update-moderator.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Moderator } from './entities/moderator.entity';

@Injectable()
export class ModeratorsService {
  constructor(private readonly prismaService: PrismaService) {}

  async update(formId: string, updateModeratorDto: UpdateModeratorDto) {
    return (
      await this.prismaService.$transaction([
        this.prismaService.moderator.deleteMany({
          where: {
            formId: formId,
          },
        }),
        this.prismaService.moderator.createMany({
          data: updateModeratorDto.moderatorLogins.map((moderatorLogin) => ({
            formId: formId,
            moderatorLogin: moderatorLogin,
          })),
        }),
      ])
    )[1];
  }

  async findAll(formId: string): Promise<Moderator[]> {
    return (
      await this.prismaService.moderator.findMany({
        where: {
          formId: formId,
        },
      })
    ).map((moderator) => new Moderator(moderator.moderatorLogin));
  }

  async isModerator(formId: string, moderatorLogin: string): Promise<boolean> {
    return (
      !!(await this.prismaService.moderator.findFirst({
        where: {
          formId: formId,
          moderatorLogin: moderatorLogin,
        },
      })) || false
    );
  }
}
