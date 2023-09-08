import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class ItemDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  @IsNotEmpty()
  updatedAt: string;

  @IsNumber()
  @IsNotEmpty()
  project: number;

  @IsNumber()
  parentItem: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  creator: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  timeAllocated: number;

  @IsOptional()
  @IsNumber()
  timeSpent: number;

  @IsBoolean()
  @IsNotEmpty()
  isComplete: boolean;

  @IsString()
  colour: string;

  constructor(data: ItemDto) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.project = data.project;
    this.parentItem = data.parentItem;
    this.name = data.name;
    this.creator = data.creator;
    this.description = data.description;
    this.timeAllocated = data.timeAllocated;
    this.timeSpent = data.timeSpent;
    this.isComplete = data.isComplete;
    this.colour = data.colour;
  }
}
