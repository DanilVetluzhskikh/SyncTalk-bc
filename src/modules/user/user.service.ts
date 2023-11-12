import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserCreationAttributes } from './models/user.model';
import { Profile } from './models/profile.model';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { UserInfoDto } from './dto/user-info-dto';
import { StatusDto } from './dto/status-dto';
import { Friendship } from './models/friendship.model';
import { StatusFriendRequest, UserSubscribeAction } from 'src/types/shared';
import { EventsService } from '../event/event.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Profile) private profileRepository: typeof Profile,
    @InjectModel(Friendship) private friendsRepository: typeof Friendship,
    private readonly eventsService: EventsService,
    private readonly sequelize: Sequelize,
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

  async findUserById(id: string | number) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
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
          status: 'В сети',
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

  async info(email?: string) {
    if (!email) {
      throw new Error('Не прошли авторизацию');
    }

    try {
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
        include: [this.profileRepository],
        attributes: {
          exclude: ['passwordHash'],
        },
      });

      if (!user) {
        throw new HttpException(
          `Пользователь не найден`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return user;
    } catch (e) {
      throw new HttpException(
        `Что-то пошло не так ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async changeUserInfo(email: string, dto: UserInfoDto) {
    try {
      const transaction = await this.sequelize.transaction();

      const [res, [info]] = await this.userRepository.update(
        {
          username: dto.username,
        },
        {
          where: {
            email: email,
          },
          transaction,
          returning: true,
        },
      );

      const [resProfile, [profileInfo]] = await this.profileRepository.update(
        {
          avatarURL: dto.avatar,
        },
        {
          where: {
            id: info.profileId,
          },
          transaction,
          returning: true,
        },
      );

      if (res === 0 || resProfile === 0) {
        throw new HttpException(
          'Не удалось обновить данные',
          HttpStatus.BAD_REQUEST,
        );
      }

      await transaction.commit();

      return {
        username: info.username,
        avatarURL: profileInfo.avatarURL,
      };
    } catch (e) {
      throw new HttpException(
        'Не удалось обновить данные',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async changeStatus(email: string, statusDto: StatusDto) {
    try {
      const transaction = await this.sequelize.transaction();

      const user = await this.userRepository.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw new HttpException(
          'Не удалось найти пользователя',
          HttpStatus.BAD_REQUEST,
        );
      }

      const [resProfile, [profileInfo]] = await this.profileRepository.update(
        {
          status: statusDto.status,
        },
        {
          where: {
            id: user.profileId,
          },
          transaction,
          returning: true,
        },
      );

      if (resProfile === 0) {
        throw new HttpException(
          'Не удалось обновить данные',
          HttpStatus.BAD_REQUEST,
        );
      }

      await transaction.commit();

      return {
        status: profileInfo.status,
      };
    } catch (e) {
      throw new HttpException(
        'Не удалось обновить данные',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async users(
    id: number,
    search: string,
    page: number = 1,
    pageSize: number = 15,
  ) {
    try {
      const limit = page * pageSize;

      const { count, rows } = await this.userRepository.findAndCountAll({
        where: {
          username: {
            [Op.iLike]: `%${search}%`,
          },
          id: {
            [Op.not]: id,
          },
        },
        include: [this.profileRepository],
        limit,
        order: [['username', 'ASC']],
      });

      const friendsCreaters = await this.friendsRepository.findAll({
        where: {
          userId: id,
        },
      });

      const friends = await this.friendsRepository.findAll({
        where: {
          friendId: id,
        },
      });

      const users = rows.map((user) => ({
        avatarURL: user.profile.avatarURL,
        username: user.username,
        isFriend:
          friendsCreaters.find(
            (friend) =>
              friend.friendId === user.id &&
              friend.status === StatusFriendRequest.ACCEPT,
          ) ||
          friends.find(
            (friend) =>
              friend.userId === user.id &&
              friend.status === StatusFriendRequest.ACCEPT,
          ),
        id: user.id,
        requestFriend: friendsCreaters.find(
          (friend) =>
            friend.friendId === user.id &&
            friend.status === StatusFriendRequest.PENDING,
        ),
        isSentRequest: friends.find(
          (friend) =>
            friend.userId === user.id &&
            friend.status === StatusFriendRequest.PENDING,
        ),
      }));

      return {
        users,
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: page,
      };
    } catch (e) {
      throw new HttpException(
        'Не удалось получить пользователей',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async requestFriend(id: number, friendId: number) {
    try {
      const transaction = await this.sequelize.transaction();

      const result = await this.friendsRepository.create(
        {
          userId: id,
          friendId,
          status: StatusFriendRequest.PENDING,
        },
        {
          transaction,
        },
      );

      await transaction.commit();

      this.eventsService.notifySubscribers(friendId, {
        userId: id,
        type: UserSubscribeAction.REQUEST_FRIEND,
      });

      return result;
    } catch (e) {
      throw new HttpException(
        'Не удалось отправить заявку',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async acceptFriend(id: number, friendId: number) {
    try {
      const transaction = await this.sequelize.transaction();

      const request = await this.friendsRepository.findOne({
        where: {
          friendId: id,
          userId: friendId,
          status: StatusFriendRequest.PENDING,
        },
      });

      if (!request) {
        throw new HttpException(
          'Не удалось найти заявку',
          HttpStatus.NOT_FOUND,
        );
      }

      const result = await request.update(
        {
          status: StatusFriendRequest.ACCEPT,
        },
        {
          transaction,
        },
      );

      await transaction.commit();

      this.eventsService.notifySubscribers(friendId, {
        userId: id,
        type: UserSubscribeAction.ACCEPT_FRIEND,
      });

      return result;
    } catch (e) {
      throw new HttpException(
        'Не удалось принять заявку',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async declineFriend(id: number, friendId: number) {
    try {
      const transaction = await this.sequelize.transaction();

      const request = await this.friendsRepository.findOne({
        where: {
          friendId: id,
          userId: friendId,
          status: StatusFriendRequest.PENDING,
        },
      });

      if (!request) {
        throw new HttpException(
          'Не удалось найти заявку',
          HttpStatus.NOT_FOUND,
        );
      }

      const result = await request.destroy({
        force: true,
        transaction,
      });

      await transaction.commit();

      this.eventsService.notifySubscribers(friendId, {
        userId: id,
        type: UserSubscribeAction.DECLINE_FRIEND,
      });

      return result;
    } catch (e) {
      throw new HttpException(
        'Не удалось удалить заявку',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async declineMyFriendRequest(id: number, friendId: number) {
    try {
      const transaction = await this.sequelize.transaction();

      const request = await this.friendsRepository.findOne({
        where: {
          friendId,
          userId: id,
          status: StatusFriendRequest.PENDING,
        },
      });

      if (!request) {
        throw new HttpException(
          'Не удалось найти заявку',
          HttpStatus.NOT_FOUND,
        );
      }

      const result = await request.destroy({
        force: true,
        transaction,
      });

      await transaction.commit();

      this.eventsService.notifySubscribers(friendId, {
        userId: id,
        type: UserSubscribeAction.DECLINE_MY_FRIEND_REQUEST,
      });

      return result;
    } catch (e) {
      throw new HttpException(
        'Не удалось удалить заявку',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteFriend(id: number, friendId: number) {
    try {
      const transaction = await this.sequelize.transaction();

      const myRequest = await this.friendsRepository.findOne({
        where: {
          friendId,
          userId: id,
          status: StatusFriendRequest.ACCEPT,
        },
      });

      const request = await this.friendsRepository.findOne({
        where: {
          friendId: id,
          userId: friendId,
          status: StatusFriendRequest.ACCEPT,
        },
      });

      if (!request && !myRequest) {
        throw new HttpException(
          'Не удалось найти заявку',
          HttpStatus.NOT_FOUND,
        );
      }

      if (request) {
        await request.destroy({
          transaction,
          force: true,
        });
      } else {
        await myRequest.destroy({
          transaction,
          force: true,
        });
      }

      await transaction.commit();

      this.eventsService.notifySubscribers(friendId, {
        userId: id,
        type: UserSubscribeAction.DELETE_FRIEND,
      });

      return true;
    } catch (e) {
      throw new HttpException(
        'Не удалось удалить заявку',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
