import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
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
  app.use();
  app.enableCors({
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT || 4200);
}
bootstrap();
