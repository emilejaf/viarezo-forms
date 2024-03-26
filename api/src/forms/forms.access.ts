import { FormAccess } from 'src/access/access';
import { Form } from './entities/form.entity';
import { FormsService } from './forms.service';
import { User } from 'src/auth/entities/user.entity';

export class FormsAccess extends FormAccess {
  constructor(private readonly formsService: FormsService) {
    super();
  }

  public async authorize(request: any, form: Form) {
    if (!form.uniqueAnswer) return true;

    const user: User | undefined = request.user;

    if (!user) return false;

    const hasAnswered = await this.formsService.hasAnswered(
      form.id,
      user.login,
    );

    return !hasAnswered;
  }
  public createAction() {}
  public updateAction() {}
}
