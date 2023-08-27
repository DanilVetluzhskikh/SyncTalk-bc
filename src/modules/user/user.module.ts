import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Profile } from './models/profile.model';
import { Friendship } from './models/friendship.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Profile, Friendship])],
})
export class UserModule {}
