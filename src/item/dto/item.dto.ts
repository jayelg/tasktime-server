import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { IItem } from '../interface/item.interface';

export class ItemDto implements IItem {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  project: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  creator: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  @IsNotEmpty()
  updatedAt: string;

  @IsString()
  description: string;

  @IsArray()
  allocatedTo: string[];

  @IsOptional()
  @IsNumber()
  timeAllocated: number;

  @IsOptional()
  @IsNumber()
  timeSpent: number;

  @IsBoolean()
  @IsNotEmpty()
  isComplete: boolean;

  @IsBoolean()
  @IsNotEmpty()
  reqReview: boolean;

  @IsArray()
  reviewers: string[];

  @IsString()
  colour: string;

  @IsArray()
  nestedItemIds: string[];

  @IsString()
  parentItemId: string;

  @IsString()
  predecessorItemId: string;

  @IsString()
  successorItemId: string;

  @IsString()
  itemObjects: object;
}
