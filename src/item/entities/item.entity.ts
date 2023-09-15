import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Project } from '../../project/entities/project.entity';
import { User } from '../../user/entities/user.entity';
import { CustomBaseEntity } from '../../shared/entities/customBase.entity';
import { ItemRepository } from '../repositories/item.repository';
import { ItemAncestry } from './itemAncestry.entity';

@Entity({ customRepository: () => ItemRepository })
export class Item extends CustomBaseEntity {
  [EntityRepositoryType]?: ItemRepository;

  @ManyToOne(() => Project)
  project: Project;

  @OneToMany(() => ItemAncestry, (ancestry) => ancestry.ancestor)
  ancestors: Collection<ItemAncestry>;

  @OneToMany(() => ItemAncestry, (ancestry) => ancestry.descendant)
  descendants: Collection<ItemAncestry>;

  @ManyToOne(() => Item, { nullable: true })
  hostItem?: Item;

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
