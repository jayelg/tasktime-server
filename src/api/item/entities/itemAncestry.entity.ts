import { Entity, EntityRepositoryType, ManyToOne } from '@mikro-orm/core';
import { Item } from './item.entity';
import { CustomBaseEntity } from '../../../shared/entities/customBase.entity';
import { ItemAncestryRepository } from '../repositories/itemAncestry.repository';

@Entity({ customRepository: () => ItemAncestryRepository })
export class ItemAncestry extends CustomBaseEntity {
  [EntityRepositoryType]?: ItemAncestryRepository;

  @ManyToOne(() => Item)
  ancestor: Item;

  @ManyToOne(() => Item)
  descendant: Item;

  constructor(ancestor: Item, descendant: Item) {
    super();
    this.ancestor = ancestor;
    this.descendant = descendant;
  }
}
