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
  @PrimaryKey()
  id: number;

  @ManyToOne(() => Org)
  org: Reference<Org>;

  @ManyToOne(() => User)
  member: Reference<User>;

  @Enum(() => OrgMemberRole)
  role: OrgMemberRole;

  constructor(user: Reference<User>, org: Reference<Org>) {
    this.org = org;
    this.member = user;
  }
}
