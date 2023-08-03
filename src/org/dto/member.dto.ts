import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class MemberDto {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsIn(['orgViewer', 'orgUser', 'orgProjectManager', 'orgAdmin'])
  role: string;
}
