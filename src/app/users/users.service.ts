import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { backendDBManager } from 'src/dependency-injection';
import { hash } from 'bcryptjs';

import { randomUUID } from 'node:crypto';
import { createUserModel, IUser, UserSchema } from 'models/users/users.model';

@Injectable()
export class UsersService {
  model = createUserModel(backendDBManager);
  async findAll() {
    return (await this.model.find()).map(user => {
      delete user.__v;
      return user;
    });
  }

  async findById(id: string) {
    try {
      const res = await this.model.findById(id);
      if (!res) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      delete res.__v;
      return res;
    } catch (error) {
      return error;
    }
  }

  async findByEmail(email: string) {
    try {
      const res = await this.model.findOneBy({ email });
      if (!res) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      delete res.__v;
      return res;
    } catch (error) {
      return error;
    }
  }

  async addUser(
    user: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<IUser | string> {
    try {
      const pwd = await hash(user.password, 10); // se encripta la pwd
      const id = randomUUID(); // se genera un id provisional

      const nicknameExists = (await this.findAll()).some((u) => u.nickname === user.nickname);
      if (nicknameExists) {
        console.log("this nickname already exists")
        throw new HttpException('NICKNAME_ALREADY_EXISTS', HttpStatus.BAD_REQUEST);
      }

      const emailExists = (await this.findAll()).some((u) => u.email === user.email);
      if (emailExists) {
        console.log("this email already exists")
        throw new HttpException('EMAIL_ALREADY_EXISTS', HttpStatus.BAD_REQUEST);
      }

      const newUser = {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: pwd,
        id
      }; // se crea el objeto con la pwd encriptada y el id provisional

      const valid = UserSchema.safeParse(newUser); // se valida el objeto

      if (!valid.success) {
        const error = valid.error.issues;
        throw new HttpException(
          `Error: ${error.map((err) => `${err.message} on ${err.path[0]}.\n`)}`,
          HttpStatus.BAD_REQUEST
        );
      } else {
        await this.model.insert(newUser);
        newUser.password = "???";
        return newUser;
      }
    } catch (result) {
      const error = result.issues;
      console.log(result)
      throw new HttpException(
        `${error > 0 ? error.map((err) => `Error: ${err.message} on ${err.path[0]}.\n`) : result.response}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async update(id: string, body: Partial<IUser>) {
    try {
      const find = await this.findById(id);
      const newSection = { ...find, ...body, updatedAt: new Date() };
      return await this.model.updateById(id, { values: newSection });
    } catch (error) {
      return error;
    }
  }

  async remove(id: string) {
    try {
      return this.model.deleteById(id);
    } catch (error) {
      return error;
    }
  }
}