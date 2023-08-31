import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { ServerModule } from '../server/server.module';
import { ChannelModule } from '../channel/channel.module';
import { MessageModule } from '../message/message.module';
import { CallModule } from '../call/call.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as Dialect,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadModels: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ServerModule,
    ChannelModule,
    MessageModule,
    CallModule,
  ],
})
export class AppModule {}
