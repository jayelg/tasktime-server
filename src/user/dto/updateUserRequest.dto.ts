import { ArrayModification, UpdateUserDto } from './updateUser.dto';
import { Exclude } from 'class-transformer';

export class UpdateUserRequestDto extends UpdateUserDto {
  @Exclude()
  orgs?: ArrayModification;
}
