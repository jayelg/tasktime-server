import { Injectable } from '@nestjs/common';
import { IOrgServiceUpdates } from './interface/org.interface';
import { CreateOrgDto } from './dto/createOrg.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrgCreatedEvent } from './event/orgCreated.event';
import { OrgInviteAcceptedEvent } from './event/orgInviteAccepted.event';
import { EntityManager } from '@mikro-orm/postgresql';
import { OrgRepository } from './repositories/org.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Org } from './entities/org.entity';
import { OrgMember } from './entities/orgMember.entity';
import { User } from 'src/user/entities/user.entity';
import { OrgMemberRole } from './enum/orgMemberRole.enum';

@Injectable()
export class OrgService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Org)
    private readonly orgRepository: OrgRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async getAllOrgs(userId: string): Promise<Org[]> {
    try {
      const orgMembers = await this.orgRepository.findOrgsByMemberId(userId);
      const orgRefs = orgMembers.map((orgMember) => orgMember.org);
      return await this.orgRepository.find(orgRefs);
    } catch (error) {
      throw error;
    }
  }

  async getOrg(orgId: string): Promise<Org> {
    try {
      return await this.orgRepository.findOne(orgId);
    } catch (error) {
      throw error;
    }
  }

  async createOrg(userId: string, newOrg: CreateOrgDto): Promise<Org> {
    try {
      const org = new Org(newOrg.name);
      await this.em.persistAndFlush(org);
      const userRef = this.em.getReference(User, userId);
      const orgRef = this.em.getReference(Org, org.id);
      const orgMember = new OrgMember(userRef, orgRef, OrgMemberRole.Admin);
      await this.em.persistAndFlush(orgMember);
      this.eventEmitter.emit(
        'org.created',
        new OrgCreatedEvent(org.id, org.name, org.createdAt, userId),
      );
      return org;
    } catch (error) {
      throw error;
    }
  }

  async updateOrg(orgId: string, orgUpdates: IOrgServiceUpdates): Promise<Org> {
    try {
      const org = await this.orgRepository.findOne(orgId);
      this.orgRepository.assign(org, orgUpdates);
      this.em.persistAndFlush(org);
      return org;
    } catch (error) {
      throw error;
    }
  }

  async deleteOrg(orgId: string): Promise<undefined> {
    try {
      const orgMembers = await this.orgRepository.findMembersByOrgId(orgId);
      await this.em.removeAndFlush(orgMembers);
      const org = await this.orgRepository.findOne(orgId);
      if (!org) {
        throw new Error(`Project with ID ${orgId} not found`);
      }
      await this.em.removeAndFlush(org);
    } catch (error) {
      throw error;
    }
  }

  async removeMember(
    userId: string,
    orgId: string,
    memberId: string,
  ): Promise<undefined> {
    try {
      const orgMember = await this.orgRepository.findOrgMember(memberId, orgId);
      if (!orgMember) {
        throw new Error(`User with ID ${memberId} not found`);
      }
      await this.em.removeAndFlush(orgMember);
    } catch (error) {
      throw error;
    }
  }

  // Emit event to be accepted by userService
  // userService should then add org to user
  async acceptInvite(userId: string, orgId: string): Promise<undefined> {
    this.eventEmitter.emit(
      'org.inviteAccepted',
      new OrgInviteAcceptedEvent(userId, orgId),
    );
  }

  async getMember(userId: string, orgId: string): Promise<OrgMember> {
    return await this.orgRepository.findOrgMember(userId, orgId);
  }
}
