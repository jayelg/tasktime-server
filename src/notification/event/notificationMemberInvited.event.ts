import { EventEmitter2 } from '@nestjs/event-emitter';
import { INotification } from '../interface/notification.interface';

export class NotificationMemberInvitedEvent extends EventEmitter2 {
  constructor(
    public readonly notification: INotification,
    public readonly inviteeEmail: string,
  ) {
    super();
  }
}
