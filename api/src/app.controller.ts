import { Controller, Get } from '@nestjs/common';
import { FormUtilityService } from './abstract-forms/form-utility.service';
import { User } from './auth/entities/user.entity';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly formUtility: FormUtilityService,
    private readonly appService: AppService,
  ) {}

  @Get()
  async findAll(@CurrentUser() user: User) {
    const owned = await this.formUtility.findAll(user);

    const moderated = await this.formUtility.findAllModerated(user);

    return owned.concat(moderated);
  }

  @Get('answers')
  async findAllAnswers(@CurrentUser() user: User) {
    return this.appService.findAllAnswers(user);
  }
}
