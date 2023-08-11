import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  timeAllocated: number;

  @IsOptional()
  @IsNumber()
  timeSpent: number;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  isComplete: boolean;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  reqReview: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  colour: string;

  @IsOptional()
  @IsArray()
  nestedItemIds: string[];

  @IsOptional()
  @IsString()
  parentItemId: string;

  @IsOptional()
  @IsString()
  predecessorItemId: string;

  @IsOptional()
  @IsString()
  successorItemId: string;

  @IsOptional()
  @IsArray()
  itemObjects: object[];
}
