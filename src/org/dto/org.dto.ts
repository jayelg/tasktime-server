import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { IMember } from '../interface/member.interface';
import { Org } from '../entities/org.entity';

export class OrgDto {
  @IsString()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  description: string;

  constructor(data: OrgDto) {
    this.id = data.id;
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.description = data.description;
  }
}
