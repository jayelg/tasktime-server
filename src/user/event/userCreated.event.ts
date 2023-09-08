import { EventEmitter2 } from '@nestjs/event-emitter';

export class UserCreatedEvent extends EventEmitter2 {
  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly createdAt: string,
  ) {
    super();
  }
}
