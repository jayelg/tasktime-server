import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { OnEvent } from '@nestjs/event-emitter';
import { OrgRemovedEvent } from 'src/org/event/orgRemoved.event';

@Injectable()
export class OrgRemovedListener {
  constructor(private userService: UserService) {}

  @OnEvent('org.removed', { async: true })
  async handleOrgRemovedEvent(event: OrgRemovedEvent) {
    await this.userService.updateUser(event.removedBy, {
      orgs: { remove: [event.orgId] },
    });
  }
}
