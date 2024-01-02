import { HttpExceptionFilter } from './helpers/http/http-exceptions.filter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { CustomLogger } from './modules/logger/services/logger.service';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter()); // Handles all exceptions throw by the App.
  app.use(cookieParser()); // cookie parser middleware
  // app.enableCors({
  //   origin: 'http://localhost:3000',
  //   credentials: true,
  // });
  app.enableCors({
    origin: 'https://hr-fz76pv9ix-matheusdev20.vercel.app/',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('STX-APIs')
    .setDescription('APIs and resources to manage STX entities')
    .setVersion('1.0')
    .addTag('stx')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.API_PORT);
}

bootstrap();
