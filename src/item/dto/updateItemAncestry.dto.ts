import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ItemAncestryDto } from './itemAncestry.dto';

export class UpdateItemAncestryDto {
  @ValidateNested({ each: true })
  @Type(() => ItemAncestryDto)
  @IsNotEmpty()
  newRelation: ItemAncestryDto;

  @ValidateNested({ each: true })
  @Type(() => ItemAncestryDto)
  @IsNotEmpty()
  oldRelation: ItemAncestryDto;
}
