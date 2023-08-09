import { EventEmitter2 } from '@nestjs/event-emitter';
import { INotification } from '../interface/notification.interface';

export class NotificationDeletedEvent extends EventEmitter2 {
  constructor(public readonly notification: INotification) {
    super();
  }
}
