import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FormUtilityService } from '../abstract-forms/form-utility.service';
import { AccessService } from './access.service';
import { ModeratorsService } from 'src/moderators/moderators.service';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly formsService: FormUtilityService,
    private readonly accessService: AccessService,
    private readonly moderatorService: ModeratorsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // formId can be formId or id©
    const formId: string = request.params.formId || request.params.id;

    const form = await this.formsService.getFormWithoutNestedFields(formId);

    // check if form exists
    if (!form) throw new NotFoundException();

    const authorized = await this.accessService.authorize(form, request);

    if (authorized && form.active) return true;

    // user must be logged in to access a form that he owns or moderates
    if (!request.user) return false;

    // check if the user is the owner or a moderator of the form
    // and if it is a GET request
    if (request.method != 'GET') return false;

    if (form.login == request.user.login) return true;

    return await this.moderatorService.isModerator(formId, request.user.login);
  }
}
