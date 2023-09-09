import { IMember } from './member.interface';

// remove below
export interface IOrgServiceUpdates {
  name?: string;
  description?: string;
}

export interface IOrg {
  id: string;
  name: string;
  createdAt: string;
  description: string;
  members: IMember[];
  projects: string[];
}
