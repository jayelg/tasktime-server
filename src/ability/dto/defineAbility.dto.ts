import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class defineAbilityDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  orgId?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  projectId?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  itemId?: number;
}
