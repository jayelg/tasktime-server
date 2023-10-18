import { Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AbilityModule } from './api/ability/ability.module';
import { AbilitiesGuard } from './shared/guards/abilities.guard';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { ApiModule } from './api/api.module';
import { AppUiModule } from './app-ui/app-ui.module';

@Module({
  imports: [
    ApiModule,
    AppUiModule,
    AbilityModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (/* configService: ConfigService */) =>
        mikroOrmConfig(/* configService */),
      inject: [ConfigService],
    }),
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
  configure(/* consumer: MiddlewareConsumer */) {
    // consumer.apply(JwtMiddleware).forRoutes('*'); // Apply the jwt decrypting middleware to all routes
  }
}
