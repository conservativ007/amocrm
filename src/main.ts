import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const PORT = 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // in this place we validate incoming body
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(PORT);

  console.log(`The server is listening on port ${PORT}`);
}
bootstrap();
