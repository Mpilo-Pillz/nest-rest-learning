import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { exists } from 'fs';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.password = password;

    try {
      await user.save();
    } catch (e) {
      console.log(e.code);
      if (e.code === '23505') {
        //duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}

// @EntityRepository(User)
// export class UserRepository extends Repository<User> {
//   async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
//     const { username, password } = authCredentialsDto;

//     const exists = this.findOne({username})
//     if (exists){
//       // throw some error
//       //this is not so good becuase we query the db twicw
//     }

//     const user = new User();
//     user.username = username;
//     user.password = password;

//     await user.save();
//   }
// }
