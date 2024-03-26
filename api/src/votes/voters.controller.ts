import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { VotersService } from './voters.service';
import { VoterDto } from './dto/voters.dto';
import { FormsAuthGuard } from 'src/abstract-forms/forms-auth.guard';
import { EditableGuard } from './editable.guard';

@Controller('votes/:formId/voters')
export class VotersController {
  constructor(private readonly votersService: VotersService) {}

  @UseGuards(FormsAuthGuard)
  @Get()
  findAll(@Param('formId') voteId: string) {
    return this.votersService.findAll(voteId);
  }

  @UseGuards(FormsAuthGuard, EditableGuard)
  @Post()
  async create(@Param('formId') voteId: string) {
    await this.votersService.create(voteId);
    return 'Voter created';
  }

  @UseGuards(FormsAuthGuard, EditableGuard)
  @Patch(':id')
  async update(
    @Param('formId') voteId: string,
    @Param('id') voterId: number,
    @Body() updateVoterDto: VoterDto,
  ) {
    await this.votersService.update(voteId, voterId, updateVoterDto);
    return 'Voter updated';
  }

  @UseGuards(FormsAuthGuard, EditableGuard)
  @Delete(':id')
  async delete(@Param('formId') voteId: string, @Param('id') voterId: number) {
    await this.votersService.delete(voteId, voterId);
    return 'Voter deleted';
  }
}
