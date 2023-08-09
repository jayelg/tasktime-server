import { EventEmitter2 } from '@nestjs/event-emitter';

export class UserLoginEvent extends EventEmitter2 {
  constructor(
    public readonly userFirstName: string,
    public readonly email: string,
    public readonly url: string,
    public readonly newUser: boolean,
  ) {
    super();
  }
}
