import { NestFactory } from '@nestjs/core';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from './config/pipes/validation.pipe';
import { HttpExceptionFilter } from './config/pipes/error.pipe';
import * as cookieParser from 'cookie-parser';

const runServer = async () => {
  const app = await NestFactory.create(AppModule);
  const sequelize = app.get(Sequelize);
  const port = process.env.PORT || 3000;

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: 'http://localhost:1337',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных установлено');
  } catch (error) {
    console.error('Ошибка при подключении к базе данных:', error);
    process.exit(1);
  }

  await app.listen(port, () => {
    console.log(`Сервер был запущен на порту ${port}`);
  });
};

runServer();
