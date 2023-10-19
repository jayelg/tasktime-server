import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsUUID,
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
  @IsUUID()
  hostItem?: string;
}
