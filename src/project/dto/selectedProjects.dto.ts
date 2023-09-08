import { IsNotEmpty, IsNumber } from 'class-validator';

export class SelectedProjectsDto {
  @IsNumber()
  @IsNotEmpty()
  projectIds: number[];
}
