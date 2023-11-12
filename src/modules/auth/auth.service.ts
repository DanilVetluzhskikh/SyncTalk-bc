import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register-dto';
import { UserService } from '../user/user.service';
import { Sequelize } from 'sequelize-typescript';
import { LoginDto } from './dto/login-dto';
import { Response, Request } from 'express';
import { UserType } from 'src/types/shared';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private readonly sequelize: Sequelize,
  ) {}

  async login(data: LoginDto, response: Response) {
    try {
      const currentUser = await this.validateUser(data);

      const token = await this.generateToken(currentUser.email, currentUser.id);
      const newRefreshToken = await this.generateRefreshToken({
        email: currentUser.email,
        id: currentUser.id,
      });

      response.cookie('auth_token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      response.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      response.status(200).send({ message: 'Успешная авторизация' });
    } catch (e) {
      response.status(400).json({ message: e.message });
    }
  }

  async refresh(request: Request, response: Response) {
    try {
      const refreshToken = request.cookies['refresh_token'];

      const userData = await this.verifyRefreshToken(refreshToken);

      const currentUser = await this.userService.findUserById(
        userData?.id || '',
      );

      if (!currentUser) {
        throw new HttpException(
          'Вам необходимо авторизоваться',
          HttpStatus.BAD_REQUEST,
        );
      }

      const accessToken = await this.generateToken(
        currentUser.email,
        currentUser.id,
      );
      const newRefreshToken = await this.generateRefreshToken(currentUser);

      response.cookie('auth_token', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 15,
      });
      response.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return response.status(200).send({ accessToken });
    } catch (e) {
      return response.status(400).json({ message: e.message });
    }
  }

  async register(data: RegisterDto, response: Response) {
    const transaction = await this.sequelize.transaction();
    try {
      const { email, password } = data;

      const candidate = await this.userService.findUserByEmail(email);

      if (candidate) {
        throw new HttpException(
          'Пользователь с таким email уже существует',
          HttpStatus.BAD_REQUEST,
        );
      }

      const passwordHash = await bcrypt.hash(password, 6);

      const newUser = await this.userService.createNewUser(
        {
          passwordHash,
          email,
          username: 'Новый пользователь',
        },
        transaction,
      );

      const token = await this.generateToken(newUser.email, newUser.id);
      const newRefreshToken = await this.generateRefreshToken({
        email: newUser.email,
        id: newUser.id,
      });

      response.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      response.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      await transaction.commit();

      response.status(200).send({ message: 'Успешная регистрация' });
    } catch (e) {
      await transaction.rollback();

      response.status(400).json({ message: e.message });
    }
  }

  private async generateToken(
    email: RegisterDto['email'],
    id: number | string,
  ) {
    return {
      token: this.jwtService.sign({
        email,
        id,
      }),
    };
  }

  private async validateUser(user: LoginDto) {
    const currentUser = await this.userService.findUserByEmail(user.email);
    const isPasswordEquals = await bcrypt.compare(
      user.password,
      currentUser?.passwordHash || '',
    );

    if (!isPasswordEquals || !currentUser) {
      throw new HttpException(
        'Неверный логин или пароль',
        HttpStatus.BAD_REQUEST,
      );
    }

    return currentUser;
  }

  async generateRefreshToken({ id }: UserType): Promise<string> {
    const payload = { id };
    return this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '7d',
    });
  }

  async verifyRefreshToken(token: string): Promise<any> {
    try {
      const userData = this.jwtService.verify(token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      return userData;
    } catch (error) {
      throw new HttpException('Неверный рефреш токен', HttpStatus.BAD_REQUEST);
    }
  }
}
