import { IsNotEmpty, IsArray } from 'class-validator';
import { ISelectedProjects } from '../interface/selectedProjects.interface';

export class SelectedProjectsDto implements ISelectedProjects {
  @IsArray()
  @IsNotEmpty()
  projectIds: string[];
}
