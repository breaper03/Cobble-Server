import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IUser } from 'src/models/users/users.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: Pick<IUser, 'email' | 'password' | 'nickname'>) {
    return await this.authService.login(body);
  }
}
