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
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @ManyToOne(() => Item)
  item: Reference<Item>;

  @ManyToOne(() => User)
  member: Reference<User>;

  @Enum(() => ItemMemberRole)
  role: ItemMemberRole;

  constructor(
    user: Reference<User>,
    item: Reference<Item>,
    role: ItemMemberRole,
  ) {
    this.item = item;
    this.member = user;
    this.role = role;
  }
}
