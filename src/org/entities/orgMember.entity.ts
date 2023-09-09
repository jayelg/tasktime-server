import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Reference,
} from '@mikro-orm/core';
import { Org } from './org.entity';
import { User } from '../../user/entities/user.entity';
import { OrgMemberRole } from '../enum/orgMemberRole.enum';

@Entity()
export class OrgMember {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @ManyToOne(() => Org)
  org: Reference<Org>;

  @ManyToOne(() => User)
  member: Reference<User>;

  @Enum(() => OrgMemberRole)
  role: OrgMemberRole;

  constructor(user: Reference<User>, org: Reference<Org>, role: OrgMemberRole) {
    this.org = org;
    this.member = user;
    this.role = role;
  }
}
