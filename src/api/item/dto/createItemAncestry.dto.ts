import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateItemAncestryDto {
  @IsUUID()
  @IsNotEmpty()
  ancestorItemId: string;

  @IsUUID()
  @IsNotEmpty()
  descendantItemId: string;
}
