import { User } from 'src/auth/entities/user.entity';
import { Access } from './access';

export class PromoAccess extends Access {
  public authorize(request: any, meta: string) {
    const user: User | undefined = request.user;

    if (!user) return false;

    return user.promo === parseInt(meta);
  }

  public updateAction(): void | Promise<void> {}
  public createAction(): void | Promise<void> {}
}
