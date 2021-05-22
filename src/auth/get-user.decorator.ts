import { createParamDecorator } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (data, req): User => {
    //Broken maybe look at the module cos the object is different
    return req.user;
  },
);
