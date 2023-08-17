import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class ArrayModification {
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  add?: any[] = [];

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  remove?: any[] = [];
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsOptional()
  @IsUrl()
  @IsNotEmpty()
  avatar?: string;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  orgs?: ArrayModification;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  personalProjects?: ArrayModification;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  unreadNotifications?: ArrayModification;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  unreadMessages?: ArrayModification;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  disabled?: boolean;
}
