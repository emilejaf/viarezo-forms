import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModeratorsService } from 'src/moderators/moderators.service';
import { FormUtilityService } from './form-utility.service';
import { User } from 'src/auth/entities/user.entity';
import { Reflector } from '@nestjs/core';
import { ALLOW_MODERATORS_KEY } from 'src/moderators/moderators.decorator';

@Injectable()
export class FormsAuthGuard implements CanActivate {
  constructor(
    private readonly formUtility: FormUtilityService,
    private readonly moderatorsService: ModeratorsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const formId: string = request.params.formId || request.params.id;

    const owner = await this.formUtility.getFormOwner(formId);

    if (!owner) throw new NotFoundException();

    const user: User = request.user;

    if (owner == user.login) {
      return true;
    }

    const allowModerators = this.reflector.getAllAndOverride<boolean>(
      ALLOW_MODERATORS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!allowModerators) return false;

    if (await this.moderatorsService.isModerator(formId, user.login)) {
      // to distinguish between owner and moderator
      request.owner = false;
      return true;
    }

    return false;
  }
}
