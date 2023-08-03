import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OrgModule } from './org/org.module';
// import { UserService } from './user/user.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { EventModule } from './event/event.module';
import { JwtMiddleware } from './auth/jwt.middleware';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from './mail/mail.module';
import { accessibleRecordsPlugin } from '@casl/mongoose';
import { NotificationModule } from './notification/notification.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
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
    AuthModule,
    UserModule,
    OrgModule,
    EventModule,
    MailModule,
    NotificationModule,
    MessageModule,
  ],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // default all endpoints required JWT
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*'); // Apply the middleware to all routes
  }
}
