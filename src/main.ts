import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const appName = configService.get<string>('APP_NAME');
  const appDescription = configService.get<string>('APP_DESCRIPTION');
  const port = configService.get<string>('PORT');
  const serverUrl = configService.get<string>('SERVER_URL');
  const customBasePath = 'v1';

  // swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${appName} server API`)
    .setDescription(appDescription)
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(customBasePath, app, document);

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
