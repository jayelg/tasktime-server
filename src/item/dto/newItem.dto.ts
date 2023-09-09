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
}
