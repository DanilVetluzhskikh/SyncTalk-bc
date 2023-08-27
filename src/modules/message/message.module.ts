import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './models/messages.model';
import { DirectMessage } from './models/directMessages.model';

@Module({
  imports: [SequelizeModule.forFeature([Message, DirectMessage])],
})
export class MessageModule {}
