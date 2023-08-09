import { EventEmitter2 } from '@nestjs/event-emitter';

export class UserRemovedUnreadNotificationEvent extends EventEmitter2 {
  constructor(
    public readonly notificationId: string,
    public readonly userId: string,
    public readonly removedAt: string,
  ) {
    super();
  }
}
