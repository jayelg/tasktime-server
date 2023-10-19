import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { IupdateOrg } from '../interface/updateOrg.interface';

export class UpdateOrgDto implements IupdateOrg {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
