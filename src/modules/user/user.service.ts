import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserCreationAttributes } from './models/user.model';
import { Profile } from './models/profile.model';
import { Transaction } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Profile) private profileRepository: typeof Profile,
  ) {}

  async findUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
      });

      return user;
    } catch (e) {
      throw new NotFoundException('Не удалось найти пользователя');
    }
  }

  async createNewUser(
    user: Omit<UserCreationAttributes, 'profileId'>,
    transaction: Transaction,
  ) {
    try {
      const profile = await this.profileRepository.create(
        {
          status: 'active',
          avatarUrl: '',
        },
        {
          transaction,
        },
      );

      const newUser = await this.userRepository.create(
        {
          ...user,
          profileId: profile.id,
        },
        {
          transaction,
        },
      );

      return newUser;
    } catch (e) {
      await transaction.rollback();
      throw new HttpException(
        `Не удалось создать пользователя ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
