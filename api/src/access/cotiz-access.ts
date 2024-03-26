import { CotizService } from 'src/viarezo/cotiz.service';
import { Access } from './access';
import { User } from 'src/auth/entities/user.entity';

export class CotizAccess extends Access {
  constructor(private readonly cotizService: CotizService) {
    super();
  }

  public async authorize(request: any, meta: string) {
    const user: User | undefined = request.user;

    if (!user) return false; // auth is required

    const cotizAssos = await this.cotizService.getCotizAssosForLogin(
      user.login,
    );

    const cotizAssoIds = cotizAssos.map((asso) => asso.id);

    return cotizAssoIds.includes(parseInt(meta));
  }

  public updateAction(): void | Promise<void> {}
  public createAction(): void | Promise<void> {}
}
