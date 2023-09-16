import { EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Item } from './entities/item.entity';
import { ItemAncestryRepository } from './repositories/itemAncestry.repository';
import { ItemDescendantsDto } from './dto/itemDescendants.dto';
import { ItemAncestry } from './entities/itemAncestry.entity';
import { CreateItemAncestryDto } from './dto/createItemAncestry.dto';

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
      const relationship = new CreateItemAncestryDto();
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

  // check all rules for relationships are met
  // checks should be ordered in ascending order of processing cost.
  private async validateRelation(
    ancestorId: string,
    descendantId: string,
  ): Promise<ItemAncestry> {
    try {
      const ancestor = await this.em.findOne(Item, ancestorId);
      const descendant = await this.em.findOne(Item, descendantId);
      if (!ancestor || !descendant) {
        throw new NotFoundException('Ancestor or Descendant not found');
      }
      if (ancestor.hostItem !== descendant.hostItem) {
        throw new ForbiddenException(
          'Ancestor and Descendant are not in the same scope',
        );
      }
      const hasCycle = await this.isCyclePresentDFS(ancestorId, descendantId);
      if (hasCycle) {
        throw new ForbiddenException(
          'new relationship will cause a cycle which is not allowed.',
        );
      }
      return new ItemAncestry(ancestor, descendant);
    } catch (error) {
      throw error;
    }
  }

  private async isCyclePresentDFS(
    ancestorId: string,
    descendantId: string,
    visited: Set<string> = new Set(),
  ): Promise<boolean> {
    visited.add(ancestorId);

    const relationships = await this.itemAncestryRepository.find({
      descendant: ancestorId,
    });

    for (const relationship of relationships) {
      const ancestor = relationship.ancestor;

      if (ancestor.id === descendantId) {
        return true;
      }

      if (!visited.has(ancestor.id)) {
        if (await this.isCyclePresentDFS(ancestor.id, descendantId, visited)) {
          return true;
        }
      }
    }

    return false;
  }

  async createItemAncestry(
    newAncestry: CreateItemAncestryDto,
  ): Promise<ItemAncestry> {
    try {
      const itemAncestry = await this.validateRelation(
        newAncestry.ancestorItemId,
        newAncestry.descendantItemId,
      );
      await this.em.persistAndFlush(itemAncestry);
      return itemAncestry;
    } catch (error) {
      throw error;
    }
  }

  async deleteItemAncestry(itemAncestryId: string): Promise<undefined> {
    try {
      const itemAncestry = this.itemAncestryRepository.findOne(itemAncestryId);
      if (!itemAncestry) {
        throw new NotFoundException(
          `ItemAncestry with ID ${itemAncestryId} not found`,
        );
      }
      await this.em.removeAndFlush(itemAncestry);
    } catch (error) {
      throw error;
    }
  }
}
