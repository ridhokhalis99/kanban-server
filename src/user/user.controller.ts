import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';
import { SocialRegisterDto } from './dto/social-register-dto';
import { SocialLoginDto } from './dto/social-login';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }
  @Post('social-login')
  socialLogin(@Body() socialLoginDto: SocialLoginDto) {
    return this.userService.socialLogin(socialLoginDto);
  }
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }
  @Post('social-register')
  socialRegister(@Body() socialRegisterDto: SocialRegisterDto) {
    return this.userService.socialRegister(socialRegisterDto);
  }
}
