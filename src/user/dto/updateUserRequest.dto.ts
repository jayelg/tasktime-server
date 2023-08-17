import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ArrayModification, UpdateUserDto } from './updateUser.dto';
import { Exclude } from 'class-transformer';

export class UpdateUserRequestDto extends UpdateUserDto {
  @Exclude()
  orgs; // set from the org module and updated as an event effect
}
