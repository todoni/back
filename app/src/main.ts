import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { logger } from './middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.use(logger);
  app.use(cookieParser(process.env.JWT_SECRET));
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
