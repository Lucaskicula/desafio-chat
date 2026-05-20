import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { routes } from './routes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:4000',
      'http://localhost:3000',
      'http://localhost:5173'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders:
      'Content-Type, Accept, Authorization, x-aula-pos',
    credentials: true,
  });

  // WebSocket / Socket.IO
  app.useWebSocketAdapter(
    new IoAdapter(app)
  );

  app.use(routes);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  await app.listen(
    process.env.PORT ?? 3000
  );
}

bootstrap();