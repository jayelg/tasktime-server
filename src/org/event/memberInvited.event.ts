import { EventEmitter2 } from '@nestjs/event-emitter';

export class MemberInvitedEvent extends EventEmitter2 {
  constructor(
    public readonly inviteeEmail: string,
    public readonly inviteeRole: string,
    public readonly orgId: string,
    public readonly orgName: string,
    public readonly invitedAt: string,
    public readonly invitedByUserId: string,
    public readonly invitedByName: string,
  ) {
    super();
  }
}
