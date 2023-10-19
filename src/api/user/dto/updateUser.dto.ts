import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsBoolean,
} from 'class-validator';

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
  @IsBoolean()
  @IsNotEmpty()
  disabled?: boolean;
}
