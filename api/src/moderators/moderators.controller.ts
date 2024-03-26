import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ModeratorsService } from './moderators.service';
import { UpdateModeratorDto } from './dto/update-moderator.dto';
import { FormsAuthGuard } from 'src/abstract-forms/forms-auth.guard';

@Controller('moderators')
export class ModeratorsController {
  constructor(private readonly moderatorsService: ModeratorsService) {}

  @UseGuards(FormsAuthGuard)
  @Patch(':formId')
  update(
    @Param('formId') formId: string,
    @Body(ValidationPipe) updateModeratorDto: UpdateModeratorDto,
  ) {
    return this.moderatorsService.update(formId, updateModeratorDto);
  }

  @UseGuards(FormsAuthGuard)
  @Get(':formId')
  findAll(@Param('formId') formId: string) {
    return this.moderatorsService.findAll(formId);
  }
}
