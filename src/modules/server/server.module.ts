import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Server } from './models/server.model';
import { ServerMember } from './models/serverMember.model';

@Module({
  imports: [SequelizeModule.forFeature([Server, ServerMember])],
})
export class ServerModule {}
