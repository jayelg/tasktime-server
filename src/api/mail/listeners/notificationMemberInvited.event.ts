import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from '../mail.service';
import { NotificationMemberInvitedEvent } from 'src/api/notification/event/notificationMemberInvited.event';

@Injectable()
export default class NotificationMemberInvitedListener {
  constructor(private mailServer: MailService) {}

  @OnEvent('notification.memberInvited', { async: true })
  async handleNotificationMemberInvitedEvent(
    event: NotificationMemberInvitedEvent,
  ) {
    await this.mailServer.sendNotification(event);
  }
}
