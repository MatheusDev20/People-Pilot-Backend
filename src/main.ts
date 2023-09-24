import { HttpExceptionFilter } from './helpers/http/http-exceptions.filter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
// import { CustomLogger } from './modules/logger/services/logger.service';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter()); // Handles all exceptions throw by the App.
  app.use(cookieParser()); // cookie parser middleware
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(process.env.API_PORT);
}

bootstrap();
