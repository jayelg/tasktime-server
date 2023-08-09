import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { orgMemberRole } from '../enum/memberRole.enum';

export class ProjectMemberDto {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([...Object.values(orgMemberRole)])
  role: string;
}
