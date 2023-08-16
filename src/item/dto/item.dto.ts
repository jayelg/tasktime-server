import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Item } from '../item.schema';

export class ItemDto {
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

  // @IsArray()
  // itemObjects: object[];

  constructor(data: Item | ItemDto) {
    this._id = data._id.toString();
    this.project = data.project.toString();
    this.name = data.name;
    this.creator = data.creator.toString();
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.description = data.description;
    this.allocatedTo = data.allocatedTo.map((user) => user.toString());
    this.timeAllocated = data.timeAllocated;
    this.timeSpent = data.timeSpent;
    this.isComplete = data.isComplete;
    this.reqReview = data.reqReview;
    this.reviewers = data.reviewers.map((user) => user.toString());
    this.colour = data.colour;
    this.nestedItemIds = data.nestedItemIds.map((itemId) => itemId.toString());
    this.parentItemId = data.parentItemId.toString();
    this.predecessorItemId = data.predecessorItemId.toString();
    this.successorItemId = data.successorItemId.toString();
    // this.itemObjects = data.itemObjects.map((object) => object._id.toString());
  }
}
