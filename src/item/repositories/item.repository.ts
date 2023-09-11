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

  // depth represents how many item child levels deep to query
  async findItemTree(
    parentItemId: string,
    depth: number,
  ): Promise<NestedItemNode[]> {
    const sql = `
      WITH RECURSIVE all_descendants AS (
          SELECT id, name, parentItem, 1 as level
          FROM items 
          WHERE parentItem = $1 
  
          UNION ALL
  
          SELECT i.id, i.name, i.parentItem, ad.level + 1
          FROM items i
          JOIN all_descendants ad ON i.parentItem = ad.id
          WHERE ad.level < $2
      )
      SELECT * FROM all_descendants;
    `;

    const rawItems: EntityData<Partial<any>>[] = await this.em.execute(sql, [
      parentItemId,
      depth,
    ]);
    const flatItems = rawItems.map((item) => this.em.map(Item, item));

    return this.convertToNested(flatItems);
  }

  // As the SQL query in findItemTree returns a flat array of Items
  // the following method organizes the items into a nested array structure
  // to represent the parent-child relationship structure
  private convertToNested(flatItems: Item[]): NestedItemNode[] {
    // map to store items converted to NestedItemNode types
    const itemNodeMap = new Map<string, NestedItemNode>();
    // itemTree is the final structure returned
    const itemTree: NestedItemNode[] = [];

    // populate the itemNodeMap with items
    for (const item of flatItems) {
      itemNodeMap.set(item.id, { item: item, children: [] });
    }

    /*
    Below goes through items and checks for parent references.
    if there is a parent it gets the parent and assigns the current
    item as a child, otherwise it assigns the current item to the
    top level.
    */
    for (const item of flatItems) {
      const itemNode = itemNodeMap.get(item.id);

      if (item.parentItem) {
        const parent = itemNodeMap.get(item.parentItem.id);
        if (parent) {
          parent.children.push(itemNode);
        }
      } else {
        itemTree.push(itemNode);
      }
    }

    return itemTree;
  }
}
