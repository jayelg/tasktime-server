import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserService } from '../user.service';
import { OrgGetMemberEvent } from 'src/org/event/orgGetMember.event';

@Injectable()
export class OrgGetMemberListener {
  constructor(
    private userService: UserService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('org.getMember')
  handleOrgGetMemberEvent(event: OrgGetMemberEvent) {
    const user = this.userService.getUser(event.userId);
    this.eventEmitter.emit('user.getUser', user);
  }
}
