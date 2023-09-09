import { IsString, IsNotEmpty } from 'class-validator';

export class OrgDto {
  @IsString()
  @IsNotEmpty()
  id: string;

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
