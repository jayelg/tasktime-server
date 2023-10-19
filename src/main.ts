import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_PREFIX } from './shared/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { snapshot: true });
  const configService = app.get(ConfigService);

  const appName = configService.get<string>('APP_NAME');
  const appDescription = configService.get<string>('APP_DESCRIPTION');
  const port = configService.get<string>('PORT', '8080'); // env or default
  const serverUrl = configService.get<string>('SERVER_URL');
  const frontEndUrl = configService.get<string>('FRONTEND_URL');

  // swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${appName} server API`)
    .setDescription(appDescription)
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(API_PREFIX, app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // !! REMOVE FOR PRODUCTION !!
  // for dev only
  // nest will serve the frontend in production
  app.enableCors({
    origin: frontEndUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(port, () => {
    console.log(`${appName}\naccess from ${serverUrl}`);
  });
}
bootstrap();
