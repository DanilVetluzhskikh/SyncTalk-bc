import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Channel } from './models/channel.model';

@Module({
  imports: [SequelizeModule.forFeature([Channel])],
})
export class ChannelModule {}
