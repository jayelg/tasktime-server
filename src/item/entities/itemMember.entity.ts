import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Reference,
} from '@mikro-orm/core';
import { User } from '../../user/entities/user.entity';
import { Item } from './item.entity';
import { ItemMemberRole } from '../enum/itemMemberRole.enum';

@Entity()
export class ItemMember {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => Item)
  item: Reference<Item>;

  @ManyToOne(() => User)
  member: Reference<User>;

  @Enum(() => ItemMemberRole)
  role: ItemMemberRole;
}
