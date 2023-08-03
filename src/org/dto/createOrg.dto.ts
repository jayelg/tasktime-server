import { IsNotEmpty, IsString } from 'class-validator';
import { IcreateOrg } from '../interface/createOrg.interface';

export class CreateOrgDto implements IcreateOrg {
  @IsString()
  @IsNotEmpty()
  name: string;
}
