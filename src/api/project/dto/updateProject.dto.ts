import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
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
  // need to add custom validation decorator to check if it is in 15 minute increments
  timeAllocated: number;

  @IsOptional()
  @IsBoolean()
  isComplete: boolean;

  @IsOptional()
  @IsBoolean()
  isHidden: boolean;
}
