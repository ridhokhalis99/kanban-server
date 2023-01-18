import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';
import { PrismaClient } from '@prisma/client';
import { hashSync, compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { env } from 'process';

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
      const token = sign({ id: user.id }, env.SECRET_KEY);
      return { token };
    } catch (error) {
      if (
        error.message === 'User not found' ||
        error.message === 'Invalid password'
      ) {
        return { error: error.message };
      }
      console.log(error);
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
        return { error: 'Email already exists' };
      }
      console.log(error);
    }
  }
}
