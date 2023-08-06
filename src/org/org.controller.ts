import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

//Services
import { UserService } from 'src/user/user.service';
import { OrgService } from './org.service';
import { ProjectService } from 'src/project/project.service';
import { NotificationService } from 'src/notification/notification.service';
import { MailService } from 'src/mail/mail.service';

// DTO
import { CreateOrgDto } from './dto/createOrg.dto';
import { UpdateOrgDto } from './dto/updateOrg.dto';
import { NewMemberRequestDto } from './dto/newMemberRequest.dto';
import { CreateProjectDto } from 'src/project/project.dto';
import { CreateNotificationDto } from 'src/notification/dto/createNotification.dto';
// Interface
import { IOrg, IOrgServiceUpdates } from './interface/org.interface';
import { IProject } from 'src/project/interface/project.interface';
import { IUser } from 'src/user/interface/user.interface';
import { MemberDto } from './dto/member.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrgDto } from './dto/org.dto';

@Controller('org')
@ApiTags('org')
export class OrgController {
  constructor(
    private readonly userService: UserService,
    private readonly orgService: OrgService,
    private readonly projectService: ProjectService,
    private readonly notificationService: NotificationService,
    private readonly mailService: MailService,
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

  @Get()
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({
    status: 200,
    description: 'Array of organizations',
    type: [OrgDto],
  })
  async getAllOrgs(@Req() req): Promise<OrgDto[]> {
    const { orgs } = await this.userService.getUser(req.userId);
    if (!orgs) {
      return [];
    }
    return await this.orgService.getOrgs(req.userId, orgs);
  }

  @Post()
  async createOrg(@Req() req, @Body() newOrg: CreateOrgDto): Promise<IOrg> {
    const org = await this.orgService.createOrg(req.userId, newOrg);
    await this.userService.updateUser(req.userId, { orgs: [org._id] });
    return org;
  }

  @Get(':orgId')
  @ApiOperation({ summary: 'Get an organization by ID' })
  @ApiResponse({ status: 200, description: 'The organization', type: OrgDto })
  async getOrg(@Req() req, @Param('orgId') orgId: string): Promise<OrgDto> {
    return await this.orgService.getOrg(req.userId, orgId);
  }

  // todo:
  // still no error when property is not in schema, just returns without changes.
  @Patch(':orgId')
  async updateOrg(
    @Req() req,
    @Param('orgId') orgId: string,
    @Body() orgUpdates: UpdateOrgDto,
  ): Promise<IOrg> {
    const internalOrgUpdates: UpdateOrgDto = orgUpdates;
    return await this.orgService.updateOrg(
      req.userId,
      orgId,
      internalOrgUpdates,
    );
  }

  @Delete(':orgId')
  async deleteOrg(@Req() req, @Param('orgId') orgId: string) {
    return await this.orgService.deleteOrg(req.userId, orgId);
  }

  @Get(':orgId/project')
  async getAllProjects(
    @Req() req,
    @Param('orgId') orgId: string,
  ): Promise<string[]> {
    const { projects } = await this.orgService.getOrg(req.userId, orgId);
    return projects;
  }

  @Post(':orgId/project')
  async createProject(
    @Req() req,
    @Param('orgId') orgId: string,
    @Body() newProject: CreateProjectDto,
  ): Promise<IProject> {
    await this.orgService.authorizeUserForOrg(req.userId, orgId, 'orgAdmin');
    const project: IProject = await this.projectService.createProject(
      req.userId,
      orgId,
      newProject,
    );
    const updates: IOrgServiceUpdates = {
      projects: [project._id.toString()],
    };

    await this.orgService.updateOrg(req.userId, orgId, updates);
    return project;
  }

  // Invite member method
  //
  // check the current user is authorized to invite members
  // if user doesn't exist create user, pass down newUser=true
  // check if user is already a member of org
  // if not, user id and role is added to member array in org
  // create notification for user > sends notification email(isNewUser=true/false)
  // notification links to page /orgInvite/:notificationId showing more details of org and invitee with link to sign up/login
  // when user is logged in notification should display
  // notification should contain org _id in its data property (not visible to user)
  // when user clicks join org in notification it sends a request to add org to user
  // org is checked for member
  // if member, user orgs is updated
  @Post(':orgId/members/invite')
  async inviteMember(
    @Req() req,
    @Param('orgId') orgId: string,
    @Body() newMemberData: NewMemberRequestDto,
  ) {
    await this.orgService.authorizeUserForOrg(req.userId, orgId, 'orgAdmin');
    const org = await this.orgService.getOrg(req.userId, orgId);
    let newMember = await this.userService.findUserByEmail(newMemberData.email);
    let isNewUser = false;
    if (!newMember) {
      isNewUser = true;
      newMember = await this.userService.createUser(newMemberData.email);
    }

    if (org.members.some((member) => member._id === newMember._id)) {
      throw new ConflictException('User is already a member of organization');
    }
    await this.orgService.updateOrg(req.userId, orgId, {
      members: [{ _id: newMember._id, role: newMemberData.role }],
    });
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
    const notificationId = notification._id.toString();
    await this.userService.updateUser(newMember._id.toString(), {
      unreadNotifications: [notificationId],
    });
    return await this.mailService.sendNotification(
      newMember,
      notification,
      isNewUser,
    );
  }

  @Post(':orgId/members/acceptInvite')
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

  @Get(':orgId/members/byEmail')
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

  @Get(':orgId/members/:memberId')
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

  @Delete(':orgId/member/:memberId')
  async removeMember(
    @Req() req,
    @Param('orgId') orgId: string,
    @Param('memberId') memberId: string,
  ) {
    try {
      await this.orgService.authorizeUserForOrg(req.userId, orgId, 'orgAdmin');
      await this.orgService.removeMember(req.userId, orgId, memberId);
      await this.userService.removeOrg(orgId, memberId);
    } catch (error) {
      throw error;
    }
  }
}
