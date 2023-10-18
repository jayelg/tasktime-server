import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Org } from '../../org/entities/org.entity';
import { User } from '../../user/entities/user.entity';
import { ProjectRepository } from '../repositories/project.repository';
import { CustomBaseEntity } from '../../../shared/entities/customBase.entity';

@Entity({ customRepository: () => ProjectRepository })
export class Project extends CustomBaseEntity {
  [EntityRepositoryType]?: ProjectRepository;

  @ManyToOne(() => Org)
  org: Org;

  @Property()
  name = 'New Project';

  @ManyToOne(() => User)
  creator: User;

  @Property()
  description = '';

  @Property()
  timeAllocated = 0;

  @Property({ type: 'boolean' })
  isComplete = false;

  @Property({ type: 'boolean' })
  isHidden = false;

  constructor(user: User, org: Org, name: string) {
    super();
    this.creator = user;
    this.org = org;
    this.name = name;
  }
}
