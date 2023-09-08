import { EntityRepository } from '@mikro-orm/postgresql';
import { Org } from '../entities/org.entity';
import { OrgMember } from '../entities/orgMember.entity';

export class OrgRepository extends EntityRepository<Org> {
  async findMembersByOrgId(orgId: number): Promise<OrgMember[]> {
    return this.em.find(OrgMember, { org: orgId });
  }

  async findOrgMember(userId: number, orgId: number): Promise<OrgMember> {
    const orgMember = await this.em.findOne(OrgMember, {
      member: userId,
      org: orgId,
    });
    if (orgMember) {
      await orgMember.member.load();
    }
    return orgMember;
  }
}
