import { EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Item } from './entities/item.entity';
import { ItemAncestryRepository } from './repositories/itemAncestry.repository';
import { ItemDescendantsDto } from './dto/itemDescendants.dto';
import { UpdateItemAncestryDto } from './dto/updateItemAncestry.dto';
import { ItemAncestry } from './entities/itemAncestry.entity';
import { ItemAncestryDto } from './dto/itemAncestry.dto';

@Injectable()
export class ItemAncestryService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Item)
    private readonly itemAncestryRepository: ItemAncestryRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  private readonly DEFAULT_DEPTH = 10;

  async getItemDescendants(
    itemId: string,
    inputDepth?: number,
  ): Promise<ItemDescendantsDto> {
    const item = await this.em.findOne(Item, itemId);
    if (!item) {
      throw new Error('Item not found');
    }
    let maxDepth = this.DEFAULT_DEPTH;
    if (inputDepth) {
      maxDepth = inputDepth;
    }

    // NOTE! when updating, consider risks of sql injection
    // maxDepth is validated as a number
    // item.id is pulled from a valid item in the db.
    const relationshipQuery = `
    WITH RECURSIVE hierarchy AS (
      -- Base case
      SELECT ancestryRelation.*, 1 as depthLevel 
      FROM item_ancestry as ancestryRelation
      WHERE ancestryRelation.ancestor_id = '${item.id}'
  
      UNION ALL
  
      -- Recursive part
      SELECT deeperAncestry.*, parentHierarchy.depthLevel + 1 as depthLevel
      FROM item_ancestry as deeperAncestry
      INNER JOIN hierarchy as parentHierarchy ON deeperAncestry.ancestor_id = parentHierarchy.descendant_id
      WHERE parentHierarchy.depthLevel < ${maxDepth}
  )
  
  SELECT * FROM hierarchy;
    `;

    const relationshipsData = await this.em.execute(relationshipQuery);
    const relationships = relationshipsData.map((record) => {
      const relationship = new ItemAncestryDto();
      relationship.ancestorItemId = record.ancestor_id;
      relationship.descendantItemId = record.descendant_id;
      return relationship;
    });

    const itemMap = new Map();
    relationships.forEach((relationship) => {
      itemMap.set(relationship.descendantItemId, null);
      itemMap.set(relationship.ancestorItemId, null);
    });
    const itemIds = Array.from(itemMap.keys());

    const qb = this.em.createQueryBuilder(Item, 'item');
    const items = await qb
      .select('*')
      .where({ id: { $in: itemIds } })
      .execute();

    return { items, relationships };
  }

  async createItemAncestry(
    newAncestry: ItemAncestryDto,
  ): Promise<ItemAncestry> {
    try {
      const ancestor = await this.em.findOne(Item, newAncestry.ancestorItemId);
      const descendant = await this.em.findOne(
        Item,
        newAncestry.descendantItemId,
      );
      if (!ancestor || !descendant) {
        throw new Error('Ancestor or Descendant not found');
      }
      const itemAncestry = new ItemAncestry(ancestor, descendant);
      await this.em.persistAndFlush(itemAncestry);
      return itemAncestry;
    } catch (error) {
      throw error;
    }
  }

  async updateItemAncestry(
    updates: UpdateItemAncestryDto,
  ): Promise<ItemAncestry> {
    try {
      if (updates.oldRelation) {
        const oldAncestry = await this.itemAncestryRepository.findOne({
          ancestor: updates.oldRelation.ancestorItemId,
          descendant: updates.oldRelation.descendantItemId,
        });

        if (oldAncestry) {
          await this.itemAncestryRepository.removeAndFlush(oldAncestry);
        }
      }

      const newAncestry = this.itemAncestryRepository.create({
        ancestor: updates.newRelation.ancestorItemId,
        descendant: updates.newRelation.descendantItemId,
      });

      await this.em.persistAndFlush(newAncestry);

      return newAncestry;
    } catch (error) {
      throw error;
    }
  }
}
