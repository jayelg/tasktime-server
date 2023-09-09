// extends the request object with the decoded JWT payload that is added by the jwt validation
import { IsEmail, IsNumber } from 'class-validator';
import { Request } from 'express';

class UserData {
  @IsNumber()
  id: string;

  @IsEmail()
  email: string;
}

export class UserRequestDto extends Request {
  user: UserData;
}
