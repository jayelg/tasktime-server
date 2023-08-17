import { EventEmitter2 } from '@nestjs/event-emitter';
import { INotification } from '../interface/notification.interface';

export class NotificationCreatedEvent extends EventEmitter2 {
  constructor(public readonly notification: INotification) {
    super();
  }
}
