import { NestFactory } from '@nestjs/core';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from './modules/app/app.module'; // Поправьте путь к AppModule
import { ValidationPipe } from './config/pipes/validation.pipe';
import { HttpExceptionFilter } from './config/pipes/error.pipe'; // Поправьте название пайпа

const runServer = async () => {
  const app = await NestFactory.create(AppModule);
  const sequelize = app.get(Sequelize);
  const port = process.env.PORT || 3000; // Используйте || вместо ??

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();

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
