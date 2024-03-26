import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { ConfigService } from '@nestjs/config';
import { unsealData } from 'iron-session';
import { User } from './entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    const user = await this.validate(request);

    request.user = user;

    // we check for auth even if the route is public in order to inject the user in the request because we need it in the controller
    return user != null || isPublic;
  }

  private async validate(req: Request) {
    const sessionToken = this.extractTokenFromHeader(req);

    if (!sessionToken) {
      return null;
    }

    const session = await unsealData<{ user: User | undefined }>(sessionToken, {
      password: this.config.getOrThrow<string>('SESSION_SECRET'),
    });

    return session.user || null;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (!('authorization' in request.headers)) {
      return undefined;
    }
    const [type, token] =
      (request.headers.authorization as string | undefined)?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
