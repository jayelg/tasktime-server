import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { NewMemberRequestDto } from '../dto/newMemberRequest.dto';
import { CreateNotificationDto } from 'src/notification/dto/createNotification.dto';
import { IUser } from 'src/user/interface/user.interface';
import { MemberDto } from '../dto/member.dto';
import { UserService } from 'src/user/user.service';
import { OrgService } from '../org.service';
import { NotificationService } from 'src/notification/notification.service';
import { MailService } from 'src/mail/mail.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MemberRemovedEvent } from './event/memberRemoved.event';

@Controller('org/:orgId/member')
export class MemberController {
  constructor(
    private readonly userService: UserService,
    private readonly orgService: OrgService,
    private readonly notificationService: NotificationService,
    private readonly mailService: MailService,
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

  @Post('invite')
  async inviteMember(
    @Req() req,
    @Param('orgId') orgId: string,
    @Body() newMemberData: NewMemberRequestDto,
  ) {
    // check the current user is authorized to invite members
    await this.orgService.authorizeUserForOrg(req.userId, orgId, 'orgAdmin');
    const org = await this.orgService.getOrg(req.userId, orgId);
    let newMember = await this.userService.findUserByEmail(newMemberData.email);
    let isNewUser = false;
    // if user doesn't exist create user, pass down newUser=true
    if (!newMember) {
      isNewUser = true;
      newMember = await this.userService.createUser(newMemberData.email);
    }
    // check if user is already a member of org
    if (org.members.some((member) => member._id === newMember._id)) {
      throw new ConflictException('User is already a member of organization');
    }
    // if not, user id and role is added to member array in org
    await this.orgService.updateOrg(req.userId, orgId, {
      members: [{ _id: newMember._id, role: newMemberData.role }],
    });
    // create notification
    const user = await this.userService.getUser(req.userId);
    const notificationTitle = `${
      user.firstName || user.firstName !== ''
        ? `${user.firstName} has invited you`
        : `You have been invited`
    } to join ${org.name}`;
    const newNotification: CreateNotificationDto = {
      user: newMember._id,
      title: notificationTitle,
      body: 'Click here to join',
      button: 'Accept',
      type: 'orgInvite',
      reference: newMember._id,
    };
    const notification = await this.notificationService.createNotification(
      newNotification,
    );
    // add notification to user
    const notificationId = notification._id.toString();
    await this.userService.updateUser(newMember._id.toString(), {
      unreadNotifications: [notificationId],
    });
    // send notification email
    return await this.mailService.sendNotification(
      newMember,
      notification,
      isNewUser,
    );
  }

  @Post('acceptInvite')
  async acceptInvite(@Req() req, @Param('orgId') orgId: string) {
    // check user is a member of org
    // check if user already has org
    // update user with org
    try {
      if (await this.orgService.getOrg(req.userId, orgId)) {
        await this.userService.updateUser(req.userId, { orgs: [orgId] });
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
    const org = await this.orgService.getOrg(req.userId, orgId);
    if (org) {
      const fullUser = await this.userService.findUserByEmail(body.email);
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
    const org = await this.orgService.getOrg(req.userId, orgId);
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
      await this.orgService.authorizeUserForOrg(req.userId, orgId, 'orgAdmin');
      const org = await this.orgService.removeMember(
        req.userId,
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
          req.userId,
        ),
      );
    } catch (error) {
      throw error;
    }
  }
}
