import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationCreatedEvent } from 'src/notification/event/notificationCreated.event';

@Injectable()
export class NotificationCreatedListener {
  constructor(private userService: UserService) {}

  @OnEvent('notification.created', { async: true })
  async handleNotificationCreatedEvent(event: NotificationCreatedEvent) {
    await this.userService.updateUser(event.notification.user, {
      unreadNotifications: { add: [event.notification._id] },
    });
  }
}
