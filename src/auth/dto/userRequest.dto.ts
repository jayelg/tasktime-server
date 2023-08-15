// extends the request object with the decoded JWT payload that is added by the jwt validation
import { IsEmail, IsString } from 'class-validator';
import { Request } from 'express';

class UserData {
  @IsString()
  id: string;

  @IsEmail()
  email: string;
}

export class UserRequestDto extends Request {
  user: UserData;
}
