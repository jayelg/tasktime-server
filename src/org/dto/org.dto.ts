import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { IMember } from '../interface/member.interface';

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
}
