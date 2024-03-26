import { User } from 'src/auth/entities/user.entity';
import { Access } from './access';
import { LinkCSService } from 'src/viarezo/linkcs.service';

export class AssoAccess extends Access {
  constructor(private readonly linkcsService: LinkCSService) {
    super();
  }

  public async authorize(request: any, meta: string) {
    const user: User | undefined = request.user;

    if (!user) return false; // auth is required

    const assos = await this.linkcsService.getUserAssos(user.accessToken);

    const assoIds = assos.map((asso) => asso.id);

    return assoIds.includes(parseInt(meta));
  }

  public updateAction(): void | Promise<void> {}
  public createAction(): void | Promise<void> {}
}
