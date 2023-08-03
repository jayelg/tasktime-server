import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const appName = configService.get<string>('APP_NAME');
  const port = configService.get<string>('PORT');
  const serverUrl = configService.get<string>('SERVER_URL');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(port, () => {
    console.log(`${appName}\naccess from ${serverUrl}:${port}`);
  });
}
bootstrap();
