import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class ProjectDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  org: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  creator: number;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  @IsNotEmpty()
  updatedAt: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  timeAllocated?: number;

  @IsBoolean()
  @IsNotEmpty()
  isComplete: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isHidden: boolean;

  constructor(data: ProjectDto) {
    this.id = data.id;
    this.org = data.org;
    this.name = data.name;
    this.creator = data.creator;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.description = data.description;
    this.timeAllocated = data.timeAllocated;
    this.isComplete = data.isComplete;
    this.isHidden = data.isHidden;
  }
}
