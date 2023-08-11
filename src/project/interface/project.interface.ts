import { IProjectMember } from './projectMember.interface';

export interface IProject {
  _id: string;
  org: string;
  name: string;
  creator: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  members: IProjectMember[];
  timeAllocated?: number;
  isComplete: boolean;
  isHidden: boolean;
  events: string[];
  items: string[];
}
