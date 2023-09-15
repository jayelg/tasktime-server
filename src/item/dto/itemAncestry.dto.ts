import { IsUUID, IsNotEmpty } from 'class-validator';

export class ItemAncestryDto {
  @IsUUID()
  @IsNotEmpty()
  ancestorItemId: string;

  @IsUUID()
  @IsNotEmpty()
  descendantItemId: string;
}
