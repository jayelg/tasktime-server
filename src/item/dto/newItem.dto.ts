import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class NewItemDto {
  @IsString()
  @IsNotEmpty()
  project: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  allocatedTo?: string[];

  @IsOptional()
  @IsNumber()
  timeAllocated?: number;

  @IsString()
  colour: string;

  @IsOptional()
  @IsString()
  parentItemId?: string;

  @IsOptional()
  @IsString()
  predecessorItemId?: string;
}
