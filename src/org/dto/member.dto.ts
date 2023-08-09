import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsUrl,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { IMember } from '../interface/member.interface';
import { OrgMemberRole } from '../enum/orgMemberRole.enum';

export class MemberDto implements IMember {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsIn([...Object.values(OrgMemberRole)])
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

  @IsOptional()
  @IsBoolean()
  disabled?: boolean;
}
