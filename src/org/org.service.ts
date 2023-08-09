import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, Types } from 'mongoose';
import { Org, OrgDocument } from './org.schema';
import { IOrg, IOrgServiceUpdates } from './interface/org.interface';
import { IMember } from './interface/member.interface';
import { CreateOrgDto } from './dto/createOrg.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { OrgCreatedEvent } from './event/orgCreated.event';
import { ProjectCreatedEvent } from 'src/project/event/projectCreated.event';
import { NewMemberRequestDto } from './dto/newMemberRequest.dto';
import { MemberInvitedEvent } from './event/memberInvited.event';
import { UserInvitedToOrgEvent } from 'src/user/event/userInvitedToOrg.event';

@Injectable()
export class OrgService {
  constructor(
    @InjectModel('Org') private readonly orgs: Model<Org>,
    private eventEmitter: EventEmitter2,
  ) {}

  private async getOrgAndAuthorizeUser(
    userId: string,
    orgId: string,
    requiredLevel: string,
  ): Promise<{ orgDoc: OrgDocument; member: IMember }> {
    try {
      const orgDoc = await this.orgs.findById(orgId);
      if (!orgDoc) {
        throw new NotFoundException('org not found');
      }
      const member = await this.getOrgMember(userId, this.orgDoctoIOrg(orgDoc));
      // the order defines the heirachy eg. admin has all user privilages
      const permissionLevels = [
        'orgViewer',
        'orgUser',
        'orgProjectManager',
        'orgAdmin',
      ];
      const requiredIndex = permissionLevels.indexOf(requiredLevel);
      const userIndex = permissionLevels.indexOf(member.role);
      if (!member || userIndex === -1 || userIndex < requiredIndex) {
        throw new NotFoundException(`You don't have permission.`);
      } else {
        return { orgDoc: orgDoc, member: member };
      }
    } catch (error) {
      throw error;
    }
  }

  // public interface for the above method
  async authorizeUserForOrg(memberId: string, orgId: string, role: string) {
    await this.getOrgAndAuthorizeUser(memberId, orgId, role);
  }

  orgDoctoIOrg(orgDoc: OrgDocument): IOrg {
    const org: IOrg = {
      ...orgDoc.toJSON(),
      // convert all objectId types to strings
      _id: orgDoc._id.toString(),
      // fix below seems to expose a lot more than necessery??
      members: orgDoc.members.map((member) => ({
        _id: member._id.toString(),
        role: member.role,
      })),
      projects: orgDoc.projects.map((projectId) => projectId.toString()),
    };
    return org;
  }

  private getOrgMember(userId: string, org: IOrg) {
    const member = org.members.find((member) => member._id === userId);
    if (member) {
      return member;
    } else {
      return null;
    }
  }

  async getOrgs(userId: string, orgIds: string[]): Promise<IOrg[]> {
    const orgDocs = await this.orgs.find({
      _id: { $in: orgIds },
      members: { $elemMatch: { _id: userId } },
    });
    const orgs = orgDocs.map((org) => this.orgDoctoIOrg(org));
    return orgs;
  }

  async getOrg(userId: string, orgId: string): Promise<IOrg> {
    try {
      const { orgDoc } = await this.getOrgAndAuthorizeUser(
        userId,
        orgId,
        'orgViewer',
      );
      return this.orgDoctoIOrg(orgDoc);
    } catch (error) {
      if (error instanceof MongooseError) {
        throw new ServiceUnavailableException('Database error occurred.');
      }
      if (
        (error as Error).message.includes(
          // hacky approach to identify invaid orgId error for now.
          'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer',
        )
      ) {
        throw new NotAcceptableException('Invalid organization ID.');
      }
      throw error;
    }
  }

  async createOrg(userId: string, newOrg: CreateOrgDto): Promise<IOrg> {
    try {
      const formattedOrg = new this.orgs({
        name: newOrg.name,
        members: [{ _id: new Types.ObjectId(userId), role: 'orgAdmin' }],
        createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
        updatedAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
      });
      const createdOrgDoc = await formattedOrg.save();
      const org = this.orgDoctoIOrg(createdOrgDoc);
      this.eventEmitter.emit(
        'org.created',
        new OrgCreatedEvent(org._id, org.name, org.createdAt, userId),
      );
      return org;
    } catch (error) {
      // todo: log error
      throw error;
    }
  }

  async updateOrg(
    userId: string,
    orgId: string,
    orgUpdates: IOrgServiceUpdates,
  ): Promise<IOrg> {
    try {
      const { orgDoc } = await this.getOrgAndAuthorizeUser(
        userId,
        orgId,
        'orgAdmin',
      );
      Object.assign(orgDoc, orgUpdates);
      const updatedOrg = await orgDoc.save();
      return this.orgDoctoIOrg(updatedOrg);
    } catch (error) {
      // todo: log error
      throw error;
    }
  }

  async deleteOrg(userId: string, orgId: string) {
    try {
      await this.getOrgAndAuthorizeUser(userId, orgId, 'orgAdmin');
      await this.orgs.findByIdAndDelete(orgId);
    } catch (error) {
      throw error;
    }
  }

  async removeMember(userId: string, orgId: string, memberId: string) {
    try {
      const { orgDoc } = await this.getOrgAndAuthorizeUser(
        userId,
        orgId,
        'orgAdmin',
      );
      if (!orgDoc) {
        throw new NotFoundException('org not found');
      }
      const memberIndex = orgDoc.members.findIndex(
        (m) => m._id.toString() === memberId,
      );
      if (memberIndex !== -1) {
        orgDoc.members.splice(memberIndex, 1);
        return this.orgDoctoIOrg(await orgDoc.save());
      } else {
        throw new NotFoundException('Member not found in the organization.');
      }
    } catch (error) {
      throw error;
    }
  }

  // auth either orgAdmin or projectAdmin
  async removeProject(userId: string, orgId: string, projectId: string) {
    try {
      await this.orgs
        .findByIdAndUpdate(
          orgId,
          { $pull: { projects: projectId } },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw error;
    }
  }

  // Event Listeners
  @OnEvent('project.created', { async: true })
  async projectCreated(payload: ProjectCreatedEvent) {
    try {
      await this.orgs.findByIdAndUpdate(
        payload.orgId,
        { $push: { projects: payload.projectId } },
        { new: true },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'There was an error adding project to org',
      );
    }
  }

  @OnEvent('project.deleted', { async: true })
  async projectDeleted(payload: ProjectCreatedEvent) {
    try {
      await this.orgs.findByIdAndUpdate(
        payload.orgId,
        { $pull: { projects: payload.projectId } },
        { new: true },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'There was an error removing project to org',
      );
    }
  }

  @OnEvent('user.invitedToOrg', { async: true })
  async inviteMember(payload: UserInvitedToOrgEvent) {
    try {
      // Auth should happen before user is created
      const { orgDoc } = await this.getOrgAndAuthorizeUser(
        payload.invitedByUserId,
        payload.orgId,
        'orgAdmin',
      );
      const newMemberObjectId = new Types.ObjectId(payload.inviteeUserId);
      orgDoc.members.push({
        _id: newMemberObjectId,
        role: payload.role,
      });
      const org = this.orgDoctoIOrg(await orgDoc.save());
      this.eventEmitter.emit(
        'org.memberInvited',
        new MemberInvitedEvent(
          payload.inviteeEmail,
          payload.role,
          org._id,
          org.name,
          new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
          payload.invitedByUserId,
        ),
      );
    } catch (error) {
      throw error;
    }
  }
}
