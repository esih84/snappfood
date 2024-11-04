import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerConfigInit } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app);
  app.useGlobalPipes(new ValidationPipe());
  const { PORT } = process.env;
  await app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
