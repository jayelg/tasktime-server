import { EventEmitter2 } from '@nestjs/event-emitter';
import { Notification } from '../entities/notification.entity';

export class NotificationDeletedEvent extends EventEmitter2 {
  constructor(public readonly notification: Notification) {
    super();
  }
}
