import { EntityRepository } from '@mikro-orm/postgresql';
import { ItemAncestry } from '../entities/itemAncestry.entity';

export class ItemAncestryRepository extends EntityRepository<ItemAncestry> {}
