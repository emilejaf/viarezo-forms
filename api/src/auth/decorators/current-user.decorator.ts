import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User | undefined => {
    const request = context.switchToHttp().getRequest();

    return request.user;
  },
);
