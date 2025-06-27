import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { backendDBManager } from 'src/dependency-injection';
import { compare } from "bcryptjs";
import { createUserModel, IUser } from 'models/users/users.model';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService
  ) { }


  model = createUserModel(backendDBManager);

  async login(
    user: Pick<IUser, 'email' | 'password' | 'nickname'>,
  ): Promise<{ user: IUser, token: string }> {
    const findBy = user.email !== "" ? "email" : "nickname";
    console.log("findBy", findBy)
    const find = await this.model.findOneBy({ [findBy]: user[findBy] });
    if (!find) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    const checkPwd = await compare(user.password, find.password);
    if (!checkPwd) throw new HttpException('INVALID_PASSWORD', HttpStatus.UNAUTHORIZED);

    delete find.__v;

    const token = this.jwtService.sign({
      document: find.id,
    });

    return {
      user: find,
      token
    };
  }
}
