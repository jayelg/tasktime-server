import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from '../mail.service';
import { UserLoginEvent } from 'src/user/event/userLogin.event';

@Injectable()
export default class UserLoginListener {
  constructor(private mailServer: MailService) {}

  @OnEvent('user.login', { async: true })
  async handleUserLoginEvent(event: UserLoginEvent) {
    await this.mailServer.sendMagicLink(event);
  }
}
