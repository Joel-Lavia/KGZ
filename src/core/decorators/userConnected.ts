import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { json } from 'stream/consumers';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    console.log(`User connected ===> ${JSON.stringify(user)}`);

    return data ? user?.[data] : user;
  },
);
