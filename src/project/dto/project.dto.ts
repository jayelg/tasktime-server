import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ProjectMemberDto } from './projectMember.dto';
import { IProject } from '../interface/project.interface';
import { Project } from '../project.schema';

export class ProjectDto implements IProject {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  org: string;

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
  members: ProjectMemberDto[];

  @IsOptional()
  @IsNumber()
  timeAllocated?: number;

  @IsBoolean()
  @IsNotEmpty()
  isComplete: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isHidden: boolean;

  @IsArray()
  events: string[];

  @IsArray()
  items: string[];

  constructor(data: Project | ProjectDto) {
    this._id = data._id.toString();
    this.org = data.org.toString();
    this.name = data.name;
    this.creator = data.creator.toString();
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.description = data.description;
    this.members = data.members.map((member) => member._id.toString());
    this.timeAllocated = data.timeAllocated;
    this.isComplete = data.isComplete;
    this.isHidden = data.isHidden;
    this.events = data.events.map((event) => event._id.toString());
    this.items = data.items.map((item) => item._id.toString());
  }
}
