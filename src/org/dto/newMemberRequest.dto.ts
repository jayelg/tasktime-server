import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class NewMemberRequestDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsIn(['orgViewer', 'orgUser', 'orgProjectManager', 'orgAdmin'])
  role: string;
}
