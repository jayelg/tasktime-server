import { IsNotEmpty, IsEmail } from 'class-validator';

export class getUserByEmailReq {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
