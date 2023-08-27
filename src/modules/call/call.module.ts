import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Call } from './models/call.model';

@Module({
  imports: [SequelizeModule.forFeature([Call])],
})
export class CallModule {}
