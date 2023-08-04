import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { IUpdateUser } from '../interface/updateUser.interface';

export class UpdateUserDto implements IUpdateUser {
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
  orgs?: string[];

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  personalProjects?: string[];

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  unreadNotifications?: string[];

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  unreadMessages?: string[];

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  disabled?: boolean;
}
