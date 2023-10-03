import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from './mailer.service';
import UserLoginListener from './listeners/userLogin.event';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [MailService, MailerService, UserLoginListener],
  exports: [MailService],
})
export class MailModule {}
