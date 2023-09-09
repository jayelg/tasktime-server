import { EventEmitter2 } from '@nestjs/event-emitter';
import { Notification } from '../entities/notification.entity';

export class NotificationMemberInvitedEvent extends EventEmitter2 {
  constructor(
    public readonly notification: Notification,
    public readonly inviteeEmail: string,
  ) {
    super();
  }
}
