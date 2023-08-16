import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { IMember } from '../interface/member.interface';
import { Org } from '../org.schema';

export class OrgDto {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  description: string;

  @IsArray()
  members: IMember[];

  @IsArray()
  projects: string[];

  constructor(data: Org | OrgDto) {
    this._id = data._id.toString();
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.description = data.description;
    this.members = data.members.map((member) => member._id.toString());
    this.projects = data.projects.map((project) => project._id.toString());
  }
}
