import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsUrl,
  IsEmail,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { OrgMemberRole } from '../enum/orgMemberRole.enum';

export class MemberDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

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
