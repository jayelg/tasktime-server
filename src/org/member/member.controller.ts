import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { IUser } from 'src/user/interface/user.interface';
import { MemberDto } from '../dto/member.dto';
import { UserService } from 'src/user/user.service';
import { OrgService } from '../org.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MemberRemovedEvent } from './event/memberRemoved.event';

@Controller('org/:orgId/member')
export class MemberController {
  constructor(
    private readonly userService: UserService,
    private readonly orgService: OrgService,
    private eventEmitter: EventEmitter2,
  ) {}

  private reduceMember(fullUser: IUser, role: string): MemberDto {
    return {
      _id: fullUser._id,
      role: role,
      email: fullUser.email,
      firstName: fullUser.firstName,
      lastName: fullUser.lastName,
      avatar: fullUser.avatar,
      disabled: fullUser.disabled,
    };
  }

  @Post('acceptInvite')
  async acceptInvite(@Req() req, @Param('orgId') orgId: string) {
    // check user is a member of org
    // check if user already has org
    // update user with org
    try {
      if (await this.orgService.getOrg(req.user.id, orgId)) {
        await this.userService.updateUser(req.user.id, { orgs: [orgId] });
      }
    } catch (error) {
      throw error;
    }
  }

  @Get('byEmail')
  async getMemberByEmail(
    @Req() req,
    @Param('orgId') orgId: string,
    @Body() body,
  ) {
    const org = await this.orgService.getOrg(req.user.id, orgId);
    if (org) {
      const fullUser = await this.userService.getUserByEmail(body.email);
      const member = org.members.find((member) => member._id === fullUser._id);
      if (!member) {
        throw new NotFoundException('Member not found in organization.');
      }
      return this.reduceMember(fullUser, member.role);
    }
  }

  @Get(':memberId')
  async getMember(
    @Req() req,
    @Param('orgId') orgId: string,
    @Param('memberId') memberId: string,
  ) {
    const org = await this.orgService.getOrg(req.user.id, orgId);
    const member = org.members.find((member) => member._id === memberId);
    if (!member) {
      throw new NotFoundException('Member not found in organization.');
    }
    const fullUser = await this.userService.getUser(memberId);
    return this.reduceMember(fullUser, member.role);
  }

  @Delete(':memberId')
  async removeMember(
    @Req() req,
    @Param('orgId') orgId: string,
    @Param('memberId') memberId: string,
  ) {
    try {
      await this.orgService.authorizeUserForOrg(req.user.id, orgId, 'orgAdmin');
      const org = await this.orgService.removeMember(
        req.user.id,
        orgId,
        memberId,
      );
      this.eventEmitter.emit(
        'org.created',
        new MemberRemovedEvent(
          org._id,
          org.name,
          memberId,
          new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
          req.user.id,
        ),
      );
    } catch (error) {
      throw error;
    }
  }
}
