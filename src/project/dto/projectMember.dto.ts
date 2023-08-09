import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ProjectMemberRole } from '../enum/projectMemberRole.enum';

export class ProjectMemberDto {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([...Object.values(ProjectMemberRole)])
  role: string;
}
