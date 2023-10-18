import { IsNotEmpty, IsArray, IsUUID } from 'class-validator';
import { Item } from '../entities/item.entity';

class ItemAncestryIds {
  @IsUUID()
  @IsNotEmpty()
  ancestorItemId: string;

  @IsUUID()
  @IsNotEmpty()
  descendantItemId: string;
}

export class ItemDescendantsDto {
  @IsArray()
  @IsNotEmpty()
  items: Array<Item>;

  @IsArray()
  @IsNotEmpty()
  relationships: Array<ItemAncestryIds>;
}
