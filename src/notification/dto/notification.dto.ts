import { IsBoolean, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ICreateNotification } from '../interface/createNotification.interface';
import { Notification } from '../notification.schema';

export class NotificationDto implements ICreateNotification {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsBoolean()
  @IsNotEmpty()
  unread: boolean;

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

  constructor(data: Notification | NotificationDto) {
    this._id = data._id.toString();
    this.user = data.user.toString();
    this.createdAt = data.createdAt;
    this.unread = data.unread;
    this.title = data.title;
    this.body = data.body;
    this.button = data.button;
    this.type = data.type;
    this.reference = data.reference;
  }
}
