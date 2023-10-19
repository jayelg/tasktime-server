import { EntityRepository } from '@mikro-orm/postgresql';
import { Org } from '../entities/org.entity';
import { OrgMember } from '../entities/orgMember.entity';

export class OrgRepository extends EntityRepository<Org> {
  async findMembersByOrgId(orgId: string): Promise<OrgMember[]> {
    return this.em.find(OrgMember, { org: orgId });
  }

  async findOrgMember(userId: string, orgId: string): Promise<OrgMember> {
    return await this.em.findOne(OrgMember, {
      member: userId,
      org: orgId,
    });
  }

  async findOrgsByMemberId(userId: string): Promise<OrgMember[]> {
    return await this.em.find(OrgMember, {
      member: userId,
    });
  }
}
