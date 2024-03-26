import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FormDto } from './dto/form.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { FormsService } from './forms.service';
import { FormsAuthGuard } from 'src/abstract-forms/forms-auth.guard';
import { AllowModerators } from 'src/moderators/moderators.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { AccessGuard } from 'src/access/access.guard';
import { FormAnswerDto } from './dto/form-answer.dto';
import { FormUtilityService } from 'src/abstract-forms/form-utility.service';

@Controller('forms')
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
    private readonly formUtility: FormUtilityService,
  ) {}

  @Post()
  async create(@CurrentUser() user: User) {
    return this.formsService.create(user.login);
  }

  @Public()
  @UseGuards(AccessGuard)
  @Get(':id')
  async findAnswerableForm(@Param('id') id: string) {
    const form = await this.formsService.findOne(id);

    return form?.toAnswerableForm();
  }

  @UseGuards(FormsAuthGuard)
  @Get(':id/edit')
  async findEditableForm(@Param('id') id: string) {
    const form = await this.formsService.findOne(id);

    return form;
  }

  @UseGuards(FormsAuthGuard)
  @Patch(':id/edit')
  async update(@Param('id') id: string, @Body() updateFormDto: FormDto) {
    await this.formsService.update(id, updateFormDto);
  }

  @UseGuards(FormsAuthGuard)
  @Delete(':id/edit')
  async remove(@Param('id') id: string) {
    await this.formsService.remove(id);
  }

  @Public()
  @UseGuards(AccessGuard)
  @Post(':id/answer')
  async createAnswer(
    @Param('id') id: string,
    @Body() createFormAnswerDto: FormAnswerDto,
    @CurrentUser() user?: User,
  ) {
    const form = await this.formsService.findOne(id);

    if (!form || !form.fields) return;

    // Validate answser data
    const valid = await this.formUtility.validateAnswer(createFormAnswerDto, {
      fields: form.fields,
    });

    if (!valid) throw new BadRequestException('Invalid answer data');

    const by = user && !form.anonym ? user.login : undefined;
    const fullname =
      user && !form.anonym ? user.firstName + ' ' + user.lastName : undefined;

    await this.formsService.createAnswer(id, createFormAnswerDto, by, fullname);
  }

  @AllowModerators()
  @UseGuards(FormsAuthGuard)
  @Get(':id/answers')
  findAllAnswers(@Param('id') id: string) {
    return this.formsService.findAllAnswers(id);
  }
}
