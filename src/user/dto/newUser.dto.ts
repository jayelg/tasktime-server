import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { INewUser } from '../interface/newUser.interface';

export class NewUserDto implements INewUser {
  @IsEmail()
  @IsNotEmpty()
  email: string;

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
  avatar?: string;
}
