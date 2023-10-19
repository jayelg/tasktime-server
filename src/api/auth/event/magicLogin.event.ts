import { EventEmitter2 } from '@nestjs/event-emitter';

export class MagicLoginEvent extends EventEmitter2 {
  constructor(public readonly email: string, public readonly url: string) {
    super();
  }
}
