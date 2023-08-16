import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDivisibleBy,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  orgId: string;
}
