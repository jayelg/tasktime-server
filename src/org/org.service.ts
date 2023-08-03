import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, Types } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Org, OrgDocument } from './org.schema';
import { IOrg, IOrgServiceUpdates } from './interface/org.interface';
import { IMember } from './interface/member.interface';
import { CreateOrgDto } from './dto/createOrg.dto';
import { MemberDto } from './dto/member.dto';

@Injectable()
export class OrgService {
  constructor(
    @InjectModel('Org') private readonly orgs: Model<Org>,
    @InjectModel('User') private readonly users: Model<User>, // should be done in controller calling user service.
  ) {}

  private async getOrgAndAuthorizeUser(
    userId: string,
    orgId: string,
    requiredLevel: string,
  ): Promise<{ orgDoc: OrgDocument; member: IMember }> {
    const orgDoc = await this.orgs.findById(orgId);
    if (orgDoc) {
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
    }
  }

  // public interface for the above method
  async authorizeUserForOrg(member: MemberDto, orgId: string) {
    await this.getOrgAndAuthorizeUser(member._id, orgId, member.role);
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

  // any user can create their own org
  async createOrg(userId: string, newOrg: CreateOrgDto): Promise<IOrg> {
    try {
      const user = await this.users.findById(userId); // get user._id ObjectId
      const formattedOrg = new this.orgs({
        name: newOrg.name,
        members: [{ _id: user._id, role: 'orgAdmin' }],
        createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
        updatedAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
      });
      const createdOrgDoc = await formattedOrg.save();
      const createdOrg = this.orgDoctoIOrg(createdOrgDoc);
      // Update user
      user.orgs.push(createdOrgDoc._id);
      await user.save();

      return createdOrg;
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
      // handle projects array
      if ('projects' in orgUpdates) {
        if (!orgDoc.projects) {
          orgDoc.projects = [];
        }
        const projectUpdates = orgUpdates.projects.map(
          (id) => new Types.ObjectId(id),
        );
        orgDoc.projects = orgDoc.projects.concat(projectUpdates);
        delete orgUpdates.projects;
      }
      // handle members array
      if ('members' in orgUpdates && Array.isArray(orgUpdates.members)) {
        if (!orgDoc.members) {
          orgDoc.members = [];
        }
        const newMembers = orgUpdates.members.map((member) => {
          return {
            _id: new Types.ObjectId(member._id),
            role: member.role,
          };
        });
        orgDoc.members.push(...newMembers);
        delete orgUpdates.members;
      }
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

  async inviteMember(userId: string, orgId: string, newMember: MemberDto) {
    try {
      const { orgDoc } = await this.getOrgAndAuthorizeUser(
        userId,
        orgId,
        'orgAdmin',
      );
      const newMemberObjectId = new Types.ObjectId(newMember._id);
      orgDoc.members.push({
        _id: newMemberObjectId,
        role: newMember.role,
      });
      return this.orgDoctoIOrg(await orgDoc.save());
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
}
