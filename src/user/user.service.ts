import { HttpException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';
import { PrismaClient } from '@prisma/client';
import { hashSync, compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SocialRegisterDto } from './dto/social-register-dto';
import { SocialLoginDto } from './dto/social-login';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  async login(loginDto: LoginDto) {
    const { email = '', password } = loginDto;
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });
      if (!user) {
        throw new Error('User not found');
      }
      const isPasswordValid = compareSync(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      delete user.password;
      const accessToken = sign({ id: user.id }, process.env.SECRET_KEY);
      return { ...user, accessToken };
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException('User not found', 404);
      }
      if (error.message === 'Invalid password') {
        throw new HttpException('Unauthorized', 401);
      }
      console.log(error);
      throw new HttpException('Internal server error', 500);
    }
  }
  async socialLogin(socialLoginDto: SocialLoginDto) {
    const { email = '' } = socialLoginDto;
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });
      if (!user) {
        throw new Error('User not found');
      }
      delete user.password;
      const accessToken = sign({ id: user.id }, process.env.SECRET_KEY);
      return { ...user, accessToken };
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException('User not found', 404);
      }
      console.log(error);
      throw new HttpException('Internal server error', 500);
    }
  }
  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;
    const hashedPassword = hashSync(password, 10);
    try {
      await prisma.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
        },
      });
      return { message: 'User created successfully' };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('Email already exists', 400);
      }
      console.log(error);
      throw new HttpException('Internal server error', 500);
    }
  }
  async socialRegister(socialRegisterDto: SocialRegisterDto) {
    const { name, email } = socialRegisterDto;
    try {
      await prisma.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          password: 'social-login',
        },
      });
      return { message: 'User created successfully' };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('Email already exists', 400);
      }
      console.log(error);
      throw new HttpException('Internal server error', 500);
    }
  }
}
