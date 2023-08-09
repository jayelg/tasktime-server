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

class Member {
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsIn(['projectViewer', 'projectUser', 'projectAdmin'])
  role: string;
}

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  orgId: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  members: string[];

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  // need to add custom validation decorator to check if it is in 15 minute increments
  timeAllocated: number;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  isComplete: boolean;
}
