import { IMember } from './member.interface';

// remove below
export interface IOrgServiceUpdates {
  name?: string;
  description?: string;
  members?: IMember[];
  projects?: string[];
}

export interface IOrg {
  _id: string;
  name: string;
  createdAt: string;
  description: string;
  members: IMember[];
  projects: string[];
}
