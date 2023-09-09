import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  data: any;
}
