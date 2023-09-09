import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { EventModule } from './event/event.module';
import { JwtService } from '@nestjs/jwt';
// Modules
import { UserModule } from './user/user.module';
import { OrgModule } from './org/org.module';
import { ProjectModule } from './project/project.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { MessageModule } from './message/message.module';
import { ItemModule } from './item/item.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AbilityModule } from './ability/ability.module';
import { AbilitiesGuard } from './ability/abilities.guard';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        mikroOrmConfig(configService),
      inject: [ConfigService],
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
    // consumer.apply(JwtMiddleware).forRoutes('*'); // Apply the jwt decrypting middleware to all routes
  }
}
