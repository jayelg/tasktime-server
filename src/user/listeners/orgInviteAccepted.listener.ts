import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserService } from '../user.service';
import { OrgInviteAcceptedEvent } from 'src/org/event/orgInviteAccepted.event';

@Injectable()
export class OrgInviteAcceptedListener {
  constructor(private userService: UserService) {}

  @OnEvent('org.inviteAccepted')
  async handleOrgInviteAcceptedEvent(event: OrgInviteAcceptedEvent) {
    await this.userService.updateUser(event.userId, {
      orgs: { add: [event.orgId] },
    });
  }
}
