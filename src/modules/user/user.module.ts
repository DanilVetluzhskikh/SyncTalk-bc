import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Profile } from './models/profile.model';
import { Friendship } from './models/friendship.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { UsersGateway } from './user.gateway';
import { EventsService } from '../event/event.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Profile, Friendship]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, UsersGateway, EventsService],
  exports: [UserService],
})
export class UserModule {}
