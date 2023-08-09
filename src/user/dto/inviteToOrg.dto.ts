import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class InviteToOrgDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsIn(['orgViewer', 'orgUser', 'orgProjectManager', 'orgAdmin'])
  role: string;
}
