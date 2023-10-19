import { EventEmitter2 } from '@nestjs/event-emitter';

export class AuthValidateUserEvent extends EventEmitter2 {
  constructor(public readonly email: string) {
    super();
  }
}
