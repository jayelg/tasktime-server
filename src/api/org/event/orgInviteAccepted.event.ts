import { EventEmitter2 } from '@nestjs/event-emitter';

export class OrgInviteAcceptedEvent extends EventEmitter2 {
  constructor(public readonly userId: string, public readonly orgId: string) {
    super();
  }
}
