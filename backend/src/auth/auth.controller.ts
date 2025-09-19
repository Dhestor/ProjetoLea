import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(@Body() signInDto: { email: string; password: string }) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('register')
  async signUp(@Body() signUpDto: { email: string; password: string; name: string }) {
    return this.authService.signUp(signUpDto.email, signUpDto.password, signUpDto.name);
  }

  @Post('logout')
  async signOut() {
    return this.authService.signOut();
  }
}
