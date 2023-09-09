import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NotificationDto {
  @IsNumber()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  @IsNotEmpty()
  updatedAt: string;

  @IsBoolean()
  @IsNotEmpty()
  read: boolean;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  data: any[];

  constructor(data: NotificationDto) {
    this.id = data.id;
    this.user = data.user;
    this.createdAt = data.createdAt;
    this.read = data.read;
    this.title = data.title;
    this.data = data.data;
  }
}
