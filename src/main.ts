import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   origin: [
  //     'http://localhost:3000',
  //     'https://online-cinema-nextjs-pa9fl9bo5-bohdan-dubravin.vercel.app',
  //     'http://www.example.com',
  //     'http://app.example.com',
  //     'https://example.com',
  //     'https://www.example.com',
  //     'https://app.example.com',
  //   ],
  //   methods: ['GET', 'POST'],
  //   credentials: true,
  // });

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT || 4200);
}
bootstrap();
