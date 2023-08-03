import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsUrl,
  IsEmail,
} from 'class-validator';
import { IMember } from '../interface/member.interface';

export class MemberDto implements IMember {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsIn(['orgViewer', 'orgUser', 'orgProjectManager', 'orgAdmin'])
  role: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

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
