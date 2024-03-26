import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { PapsService } from './paps.service';
import { PapsDto } from './dto/paps.dto';
import { AccessGuard } from 'src/access/access.guard';
import { AllowModerators } from 'src/moderators/moderators.decorator';
import { FormsAuthGuard } from 'src/abstract-forms/forms-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { PapsAnswerDto } from './dto/paps-answer.dto';
import { FormUtilityService } from 'src/abstract-forms/form-utility.service';

@Controller('paps')
export class PapsController {
  constructor(
    private readonly papsService: PapsService,
    private readonly abstractFormService: FormUtilityService,
  ) {}

  @Post()
  create(@CurrentUser() user: User) {
    return this.papsService.create(user.login);
  }

  @UseGuards(AccessGuard)
  @Get(':id')
  async findAnswerableForm(@Param('id') id: string) {
    const paps = await this.papsService.findOne(id);

    if (!paps) return null;

    return paps.toAnswerableForm();
  }

  @UseGuards(FormsAuthGuard)
  @Get(':id/edit')
  findEditableForm(@Param('id') id: string) {
    return this.papsService.findOne(id);
  }

  @UseGuards(FormsAuthGuard)
  @Patch(':id/edit')
  async update(@Param('id') id: string, @Body() updatePapsDto: PapsDto) {
    await this.papsService.update(id, updatePapsDto);
  }

  @UseGuards(FormsAuthGuard)
  @Delete(':id/edit')
  async remove(@Param('id') id: string) {
    await this.papsService.remove(id);
  }

  @UseGuards(AccessGuard)
  @Post(':id/answer')
  async createAnswer(
    @Param('id') id: string,
    @Body() createPapsAnswerDto: PapsAnswerDto,
    @CurrentUser() user: User,
  ) {
    if (
      !(await this.papsService.isPapsChoiceValid(
        id,
        createPapsAnswerDto.choiceId,
      ))
    ) {
      throw new BadRequestException('Invalid paps choice');
    }

    const valid = await this.abstractFormService.validateAnswer(
      createPapsAnswerDto,
      {
        formId: id,
      },
    );
    if (!valid) throw new BadRequestException('Invalid answer data');

    const fullname = user.firstName + ' ' + user.lastName;

    await this.papsService.createAnswer(
      id,
      createPapsAnswerDto,
      user.login,
      fullname,
    );
  }

  @UseGuards(AccessGuard)
  @Get(':id/answer')
  async findAnswer(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.papsService.findAnswer(id, user.login);
  }

  @UseGuards(AccessGuard)
  @Delete(':id/answer')
  async removeAnswer(@Param('id') id: string, @CurrentUser() user: User) {
    const deletedAnswer = await this.papsService.removeAnswer(id, user.login);

    if (deletedAnswer.count == 0) throw new NotFoundException();
  }

  @AllowModerators()
  @UseGuards(FormsAuthGuard)
  @Get(':id/answers')
  findAllAnswers(@Param('id') id: string) {
    return this.papsService.findAllAnswers(id);
  }

  @AllowModerators()
  @UseGuards(FormsAuthGuard)
  @Post(':id/check/:login')
  async checkAccess(@Param('id') id: string, @Param('login') login: string) {
    const result = await this.papsService.checkAccess(id, login);

    return { result };
  }
}
