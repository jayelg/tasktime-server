import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { OrgCreatedEvent } from 'src/org/event/orgCreated.event';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class OrgCreatedListener {
  constructor(private userService: UserService) {}

  @OnEvent('org.created', { async: true })
  async handleOrgRemovedEvent(event: OrgCreatedEvent) {
    await this.userService.updateUser(event.createdBy, {
      orgs: { add: [event.orgId] },
    });
  }
}
