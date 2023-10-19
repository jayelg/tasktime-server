import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class NewItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  parentItem?: string;

  @IsOptional()
  @IsNumber()
  timeAllocated?: number;

  @IsOptional()
  @IsString()
  colour?: string;

  @IsOptional()
  @IsUUID()
  hostItem?: string;
}
