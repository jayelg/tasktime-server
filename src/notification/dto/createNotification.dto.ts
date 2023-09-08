import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  @IsNotEmpty()
  user: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  data: any;
}
