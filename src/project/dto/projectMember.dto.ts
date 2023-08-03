import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class ProjectMemberDto {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['projectViewer', 'projectUser', 'projectAdmin'])
  role: string;
}
