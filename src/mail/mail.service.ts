import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { INotification } from 'src/notification/interface/notification.interface';
import { NotificationDocument } from 'src/notification/notification.schema';
import { IUser } from 'src/user/interface/user.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MailService {
  private readonly appName: string;
  private readonly appUrl: string;

  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
    private userService: UserService,
  ) {
    this.appName = this.configService.get<string>('APP_NAME');
    this.appUrl = this.configService.get<string>('SERVER_URL');
  }

  async sendMagicLink(email: string, url: string) {
    const user: IUser = await this.userService.findUserByEmail(email);
    const greeting = () => {
      if (user) {
        if (user.firstName !== '') {
          return `Welcome back ${user.firstName}!`;
        } else {
          return `Welcome back!`;
        }
      } else {
        return 'Hi there.';
      }
    };
    await this.mailerService.sendMail({
      to: email,
      subject: `Login to ${this.appName}`,
      template: './confirmation',
      context: {
        greeting,
        url,
        appName: this.appName,
        appUrl: this.appUrl,
      },
    });
  }

  async sendNotification(user, notification: INotification, newUser: boolean) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: notification.title,
      template: './notification',
      context: {
        title: notification.title,
        body: notification.body,
        button: notification.button,
        url: 'url',
        appName: this.appName,
        appUrl: this.appUrl,
      },
    });
  }
}
