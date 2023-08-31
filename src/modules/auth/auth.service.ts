import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register-dto';
import { UserService } from '../user/user.service';
import { Sequelize } from 'sequelize-typescript';
import { LoginDto } from './dto/login-dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private readonly sequelize: Sequelize,
  ) {}

  async login(data: LoginDto) {
    try {
      const currentUser = await this.validateUser(data);

      const token = await this.generateToken({
        email: currentUser.email,
        password: currentUser.passwordHash,
      });

      return token;
    } catch (e) {
      return e;
    }
  }

  async register(data: RegisterDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const { email, password } = data;

      const candidate = await this.userService.findUserByEmail(email);

      if (candidate) {
        throw new Error('Пользователь с таким email уже существует');
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

      const { token } = await this.generateToken({
        email: newUser.email,
        password: newUser.passwordHash,
      });

      await transaction.commit();

      return token;
    } catch (e) {
      await transaction.rollback();

      throw new HttpException(
        `Не удалось зарегистрироваться ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async generateToken(payload: RegisterDto) {
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(user: LoginDto) {
    const currentUser = await this.userService.findUserByEmail(user.email);
    const isPasswordEquals = await bcrypt.compare(
      user.password,
      currentUser?.passwordHash || '',
    );

    if (!isPasswordEquals || !currentUser) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    return currentUser;
  }
}
