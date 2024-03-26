import { FormAccess } from 'src/access/access';

import { User } from 'src/auth/entities/user.entity';
import { PapsService } from './paps.service';
import { Paps } from './entities/paps.entity';

export class PapsAccess extends FormAccess {
  constructor(private readonly papsService: PapsService) {
    super();
  }

  public async authorize(request: any, form: Paps) {
    if (form.start && form.start > new Date()) return false;

    if (request.method != 'POST') return true; // if method is not post, we should not check if he has already answer

    const user: User = request.user;
    // the form has a start date and hasn't started

    const hasAnswered = await this.papsService.hasAnswered(form.id, user.login);

    return !hasAnswered;
  }

  public createAction() {}
  public updateAction() {}
}
