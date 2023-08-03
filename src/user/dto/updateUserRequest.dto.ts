import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsArray,
} from 'class-validator';
import { IUpdateUser } from '../interface/updateUser.interface';

export class UpdateUserRequestDto implements IUpdateUser {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName: string;

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
  personalProjects?: string[];
}
