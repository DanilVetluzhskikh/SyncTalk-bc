import { NestFactory } from '@nestjs/core';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from 'src/modules/app/app.module';

const runServer = async () => {
  const app = await NestFactory.create(AppModule);
  const sequelize = app.get(Sequelize);
  const port = process.env.PORT ?? 3000;

  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных установлено');
  } catch (error) {
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Сервер был запущен на ${port}`);
  });
};

runServer();
