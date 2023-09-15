import { IsNotEmpty, IsArray } from 'class-validator';
import { Item } from '../entities/item.entity';
import { ItemAncestryDto } from './itemAncestry.dto';

export class ItemDescendantsDto {
  @IsArray()
  @IsNotEmpty()
  items: Array<Item>;

  @IsArray()
  @IsNotEmpty()
  relationships: Array<ItemAncestryDto>;
}
