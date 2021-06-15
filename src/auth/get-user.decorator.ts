import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);

//fixed does not ork on nest 7 upwards
// export const GetUser = createParamDecorator(
//   (data, req): User => {
//     //Broken maybe look at the module cos the object is different
//     return req.user;
//   },
// );
