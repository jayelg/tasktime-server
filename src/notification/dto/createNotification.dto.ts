import { IsBoolean, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ICreateNotification } from '../interface/createNotification.interface';

export class CreateNotificationDto implements ICreateNotification {
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  button: string;

  // add more types as I go
  @IsString()
  @IsIn(['general', 'orgInvite', 'projectAdd', 'itemToReview'])
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  reference: string;
}
