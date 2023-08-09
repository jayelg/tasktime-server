import { EventEmitter2 } from '@nestjs/event-emitter';

export class OrgRemovedEvent extends EventEmitter2 {
  constructor(
    public readonly orgId: string,
    public readonly orgName: string,
    public readonly removedAt: string,
    public readonly removedBy: string,
  ) {
    super();
  }
}
