import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { EventModule } from './event/event.module';
import { JwtMiddleware } from './auth/jwt.middleware';
import { JwtService } from '@nestjs/jwt';
import { accessibleRecordsPlugin } from '@casl/mongoose';
// Modules
import { UserModule } from './user/user.module';
import { OrgModule } from './org/org.module';
import { ProjectModule } from './project/project.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { MessageModule } from './message/message.module';
import { ItemModule } from './item/item.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AbilityModule } from './ability/ability.module';
import { AbilitiesGuard } from './ability/abilities.guard';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DATABASE_URL'),
        connectionFactory: (connection) => {
          connection.plugin(accessibleRecordsPlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    UserModule,
    OrgModule,
    ProjectModule,
    ItemModule,
    EventModule,
    MailModule,
    NotificationModule,
    MessageModule,
    AbilityModule,
  ],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AbilitiesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*'); // Apply the jwt decrypting middleware to all routes
  }
}
