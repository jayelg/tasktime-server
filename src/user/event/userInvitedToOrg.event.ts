import { EventEmitter2 } from '@nestjs/event-emitter';

export class UserInvitedToOrgEvent extends EventEmitter2 {
  constructor(
    public readonly inviteeUserId: number,
    public readonly inviteeEmail: string,
    public readonly orgId: number,
    public readonly role: string,
    public readonly invitedAt: string,
    public readonly invitedByUserId: number,
    public readonly invitedByName: string,
  ) {
    super();
  }
}
