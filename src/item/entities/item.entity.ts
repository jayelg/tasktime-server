import { Entity, ManyToOne, Property, Reference } from '@mikro-orm/core';
import { Project } from '../../project/entities/project.entity';
import { User } from '../../user/entities/user.entity';
import { CustomBaseEntity } from 'src/shared/entities/customBase.entity';

@Entity()
export class Item extends CustomBaseEntity {
  @ManyToOne(() => Project)
  project: Reference<Project>;

  @ManyToOne(() => Item)
  parentItem: Reference<Item>;

  @Property()
  name = 'New Item';

  @ManyToOne(() => User)
  creator: Reference<User>;

  @Property()
  description: string;

  @Property()
  timeAllocated = 0;

  @Property()
  timeSpent = 0;

  @Property()
  isComplete = false;

  @Property()
  colour: string;
}
