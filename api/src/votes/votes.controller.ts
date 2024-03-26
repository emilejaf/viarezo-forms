import {
  Body,
  Controller,
  Param,
  Get,
  Patch,
  Post,
  UseGuards,
  Delete,
  Query,
  NotFoundException,
  HttpCode,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { EditableGuard } from './editable.guard';
import { FormsAuthGuard } from 'src/abstract-forms/forms-auth.guard';
import { User } from 'src/auth/entities/user.entity';
import { VoteDto } from './dto/vote.dto';
import { AccessGuard } from 'src/access/access.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { VoteAnswerDto } from './dto/vote-answer.dto';
import { SymetricKey } from 'src/crypto/symetric.service';
import { MailingService } from 'src/mailing/mailing.service';
import { FormUtilityService } from 'src/abstract-forms/form-utility.service';
import { VotersService } from './voters.service';

@Controller('votes')
export class VotesController {
  constructor(
    private readonly votesService: VotesService,
    private readonly formUtility: FormUtilityService,
    private readonly mailingService: MailingService,
    private readonly votersService: VotersService,
  ) {}

  @Post()
  async create(@CurrentUser() user: User) {
    return await this.votesService.create(user.login);
  }

  @Public()
  @UseGuards(AccessGuard)
  @Get(':id')
  async findAnswerableForm(@Param('id') id: string) {
    const vote = await this.votesService.findOne(id);

    if (!vote) return null;

    return vote.toAnswerableForm();
  }

  @UseGuards(FormsAuthGuard)
  @Get(':id/edit')
  findEditableForm(@Param('id') id: string) {
    return this.votesService.findOne(id);
  }

  @UseGuards(FormsAuthGuard, EditableGuard)
  @Patch(':id/edit')
  async update(@Param('id') id: string, @Body() updateVoteDto: VoteDto) {
    await this.votesService.update(id, updateVoteDto);
  }

  @UseGuards(FormsAuthGuard)
  @Delete(':id/edit')
  async remove(@Param('id') id: string) {
    await this.votesService.remove(id);
  }

  @Public()
  @UseGuards(AccessGuard)
  @Post(':id/answer')
  async createAnswer(
    @Param('id') id: string,
    @Body() createVoteAnswerDto: VoteAnswerDto,
    @Query('key') key: string,
    @Query('iv') iv: string,
    @Query('id') keyId: string,
    @Query('user') user: string,
  ) {
    // We need to replace spaces with + because of the way the query is parsed
    const symetricKey: SymetricKey = {
      key: Buffer.from(key.replaceAll(' ', '+'), 'base64'),
      iv: Buffer.from(iv.replaceAll(' ', '+'), 'base64'),
    };

    const valid = await this.formUtility.validateAnswer(createVoteAnswerDto, {
      formId: id,
    });
    if (!valid) throw new UnauthorizedException('Invalid answer data');

    await this.votesService.createAnswer(
      id,
      createVoteAnswerDto,
      symetricKey,
      parseInt(keyId),
      parseInt(user),
    );
  }

  @UseGuards(FormsAuthGuard)
  @Get(':id/answers')
  async findAllAnswers(
    @Param('id') id: string,
    @Query('key') key?: string,
    @Query('iv') iv?: string,
  ) {
    if (!key || !iv) throw new ForbiddenException();

    // We need to replace spaces with + because of the way the query is parsed
    const symetricKey: SymetricKey = {
      key: Buffer.from(key.replaceAll(' ', '+'), 'base64'),
      iv: Buffer.from(iv.replaceAll(' ', '+'), 'base64'),
    };

    try {
      return await this.votesService.findAllAnswers(id, symetricKey);
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  @UseGuards(FormsAuthGuard, EditableGuard)
  @HttpCode(200)
  @Post(':id/start')
  public async startVote(@Param('id') id: string, @CurrentUser() user: User) {
    const vote = await this.votesService.findOne(id);

    if (!vote) throw new NotFoundException();

    const voters = await this.votersService.findAll(id);

    if (voters.some((voter) => !voter.email) || voters.length === 0)
      throw new BadRequestException(
        "Il n'y a pas de votants ou certains n'ont pas d'email",
      );

    const adminKeys = await this.votesService.generateAdminCredentials(id);

    await this.mailingService.sendMail(
      this.mailingService.templates.votesAdmin,
      user.email,
      "Administration d'un vote sécurisé",
      {
        title: vote.title,
        url: `${
          process.env.WEB_URL
        }/votes/${id}/admin?key=${adminKeys.key.toString(
          'base64',
        )}&iv=${adminKeys.iv.toString('base64')}`,
      },
    );

    const votersCredentials = await this.votesService.generateVotersCredentials(
      id,
      voters.map((voter) => ({ email: voter.email as string, id: voter.id })),
      adminKeys,
    );

    await Promise.all(
      votersCredentials.map((voterPayload) => {
        return this.mailingService.sendMail(
          this.mailingService.templates.votesVoter,
          voterPayload.email,
          vote.title,
          {
            title: vote.title,
            url: `${
              process.env.WEB_URL
            }/votes/${id}?id=${voterPayload.keyId}&user=${voterPayload.user}&key=${voterPayload.voterKeys.key.toString(
              'base64',
            )}&iv=${voterPayload.voterKeys.iv.toString('base64')}
            `,
          },
        );
      }),
    );

    await this.votesService.startVote(id);

    return 'Vote started';
  }

  @UseGuards(FormsAuthGuard)
  @HttpCode(200)
  @Post(':id/stop')
  async stopVote(@Param('id') id: string) {
    if (!(await this.votesService.stopVote(id))) {
      throw new ForbiddenException();
    }

    return 'Vote stopped';
  }
}
