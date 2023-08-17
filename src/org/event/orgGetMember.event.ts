import { EventEmitter2 } from '@nestjs/event-emitter';

export class OrgGetMemberEvent extends EventEmitter2 {
  constructor(public readonly userId: string) {
    super();
  }
}
