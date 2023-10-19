import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '../entities/user.entity';

export class UserValidatedEvent extends EventEmitter2 {
  constructor(public readonly user: User) {
    super();
  }
}
