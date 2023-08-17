import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserDto } from '../dto/user.dto';

export class GetUserEvent extends EventEmitter2 {
  constructor(public readonly user: UserDto) {
    super();
  }
}
