import { EventEmitter2 } from '@nestjs/event-emitter';

export class OrgCreatedEvent extends EventEmitter2 {
  constructor(
    public readonly orgId: string,
    public readonly orgName: string,
    public readonly createdAt: Date,
    public readonly createdBy: string,
  ) {
    super();
  }
}
