import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationMemberInvitedEvent } from 'src/notification/event/notificationMemberInvited.event';
import { UserLoginEvent } from 'src/user/event/userLogin.event';

@Injectable()
export class MailService {
  private readonly appName: string;
  private readonly appUrl: string;

  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.appName = this.configService.get<string>('APP_NAME');
    this.appUrl = this.configService.get<string>('SERVER_URL');
  }

  @OnEvent('user.login', { async: true })
  async sendMagicLink(payload: UserLoginEvent) {
    const greeting = () => {
      if (!payload.newUser) {
        if (payload.userFirstName !== '') {
          return `Welcome back ${payload.userFirstName}!`;
        } else {
          return `Welcome back!`;
        }
      } else {
        return 'Hi there.';
      }
    };
    await this.mailerService.sendMail({
      to: payload.email,
      subject: `Login to ${this.appName}`,
      template: './confirmation',
      context: {
        greeting,
        url: payload.url,
        appName: this.appName,
        appUrl: this.appUrl,
      },
    });
  }

  @OnEvent('notification.memberInvited', { async: true })
  async sendNotification(payload: NotificationMemberInvitedEvent) {
    await this.mailerService.sendMail({
      to: payload.inviteeEmail,
      subject: payload.notification.title,
      template: './notification',
      context: {
        title: payload.notification.title,
        data: payload.notification.data,
        url: 'url',
        appName: this.appName,
        appUrl: this.appUrl,
      },
    });
  }
}
