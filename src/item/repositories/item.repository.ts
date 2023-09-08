import { EntityRepository } from '@mikro-orm/postgresql'; // Import EntityManager from your driver package or `@mikro-orm/knex`
import { Item } from '../entities/item.entity';
import { ItemMember } from '../entities/itemMember.entity';

export class ItemRepository extends EntityRepository<Item> {
  async findMembersByItemId(itemId: number): Promise<ItemMember[]> {
    return this.em.find(ItemMember, { item: itemId });
  }
}
