import { EntityRepository } from '@mikro-orm/postgresql';
import { EntityData } from '@mikro-orm/core';
import { Item } from '../entities/item.entity';
import { ItemMember } from '../entities/itemMember.entity';

interface NestedItemNode {
  item: Item;
  children: NestedItemNode[];
}

export class ItemRepository extends EntityRepository<Item> {
  async findMembersByItemId(itemId: string): Promise<ItemMember[]> {
    return this.em.find(ItemMember, { item: itemId });
  }

  async findItemMember(userId: string, itemId: string): Promise<ItemMember> {
    return await this.em.findOne(ItemMember, {
      member: userId,
      item: itemId,
    });
  }

  async findItemsByMemberId(userId: string): Promise<ItemMember[]> {
    return await this.em.find(ItemMember, {
      member: userId,
    });
  }
}
