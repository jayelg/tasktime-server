import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Org, OrgDocument } from './org.schema';
import { IOrg, IOrgServiceUpdates } from './interface/org.interface';
import { IMember } from './interface/member.interface';
import { CreateOrgDto } from './dto/createOrg.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { OrgCreatedEvent } from './event/orgCreated.event';
import { ProjectCreatedEvent } from 'src/project/event/projectCreated.event';
import { MemberInvitedEvent } from './event/memberInvited.event';
import { UserInvitedToOrgEvent } from 'src/user/event/userInvitedToOrg.event';
import { OrgDto } from './dto/org.dto';

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
      const member = await this.getOrgMember(userId, new OrgDto(orgDoc));
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
  // remove after abilities guard implemented
  async authorizeUserForOrg(memberId: string, orgId: string, role: string) {
    await this.getOrgAndAuthorizeUser(memberId, orgId, role);
  }

  private getOrgMember(userId: string, org: OrgDto) {
    const member = org.members.find((member) => member._id === userId);
    if (member) {
      return member;
    } else {
      return null;
    }
  }

  async getOrgs(userId: string, orgIds: string[]): Promise<OrgDto[]> {
    const orgDocs = await this.orgs.find({
      _id: { $in: orgIds },
      members: { $elemMatch: { _id: userId } },
    });
    const orgs = orgDocs.map((org) => new OrgDto(org));
    return orgs;
  }

  async getOrg(orgId: string): Promise<OrgDto> {
    try {
      return new OrgDto(await this.orgs.findById(orgId));
    } catch (error) {
      throw error;
    }
  }

  async createOrg(userId: string, newOrg: CreateOrgDto): Promise<OrgDto> {
    try {
      const formattedOrg = new this.orgs({
        name: newOrg.name,
        members: [{ _id: new Types.ObjectId(userId), role: 'orgAdmin' }],
        createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
        updatedAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
      });
      const org = new OrgDto(await formattedOrg.save());
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
    orgId: string,
    orgUpdates: IOrgServiceUpdates,
  ): Promise<OrgDto> {
    try {
      const orgDoc = await this.orgs.findById(orgId);
      Object.assign(orgDoc, orgUpdates);
      return new OrgDto(await orgDoc.save());
    } catch (error) {
      // todo: log error
      throw error;
    }
  }

  async deleteOrg(orgId: string) {
    try {
      await this.orgs.findByIdAndDelete(orgId);
    } catch (error) {
      throw error;
    }
  }

  async removeMember(orgId: string, memberId: string) {
    try {
      const orgDoc = await this.orgs.findById(orgId);
      if (!orgDoc) {
        throw new NotFoundException('org not found');
      }
      const memberIndex = orgDoc.members.findIndex(
        (m) => m._id.toString() === memberId,
      );
      if (memberIndex !== -1) {
        orgDoc.members.splice(memberIndex, 1);
        return new OrgDto(await orgDoc.save());
      } else {
        throw new NotFoundException('Member not found in the organization.');
      }
    } catch (error) {
      throw error;
    }
  }

  // auth either orgAdmin or projectAdmin
  async removeProject(orgId: string, projectId: string) {
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
      orgDoc.members.push({
        _id: new Types.ObjectId(payload.inviteeUserId),
        role: payload.role,
      });
      const org = new OrgDto(await orgDoc.save());
      this.eventEmitter.emit(
        'org.memberInvited',
        new MemberInvitedEvent(
          payload.inviteeEmail,
          payload.role,
          org._id,
          org.name,
          new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
          payload.invitedByUserId,
          payload.invitedByName,
        ),
      );
    } catch (error) {
      throw error;
    }
  }
}
