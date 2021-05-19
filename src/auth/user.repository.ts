import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { exists } from 'fs';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    // const salt = await bcrypt.genSalt();
    // user.salt = salt;
    // console.log('swai -->', salt);
    // user.password = await this.hashPassword(password, salt);

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    // user.password = password;

    console.log(user.password);

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

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
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
