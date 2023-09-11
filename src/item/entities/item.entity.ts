import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
  Reference,
} from '@mikro-orm/core';
import { Project } from '../../project/entities/project.entity';
import { User } from '../../user/entities/user.entity';
import { CustomBaseEntity } from '../../shared/entities/customBase.entity';
import { ItemRepository } from '../repositories/item.repository';

@Entity({ customRepository: () => ItemRepository })
export class Item extends CustomBaseEntity {
  [EntityRepositoryType]?: ItemRepository;

  @ManyToOne(() => Project)
  project: Project;

  @ManyToOne(() => Item, { nullable: true })
  parentItem?: Item;

  @Property()
  name = 'New Item';

  @ManyToOne(() => User)
  creator: User;

  @Property()
  description = '';

  @Property()
  timeAllocated = 0;

  @Property()
  timeSpent = 0;

  @Property({ type: 'boolean' })
  isComplete = false;

  @Property()
  colour = '';

  constructor(user: User, project: Project, name: string) {
    super();
    this.creator = user;
    this.project = project;
    this.name = name;
  }
}
