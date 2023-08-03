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

  @IsArray()
  events: string[];

  @IsArray()
  items: string[];
}
