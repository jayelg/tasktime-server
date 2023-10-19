import { EventEmitter2 } from '@nestjs/event-emitter';

export class UserInvitedToOrgEvent extends EventEmitter2 {
  constructor(
    public readonly inviteeUserId: string,
    public readonly inviteeEmail: string,
    public readonly orgId: string,
    public readonly role: string,
    public readonly invitedAt: string,
    public readonly invitedByUserId: string,
    public readonly invitedByName: string,
  ) {
    super();
  }
}
