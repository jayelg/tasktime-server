export interface IProject {
  id: number;
  org: number;
  name: string;
  creator: number;
  createdAt: string;
  updatedAt: string;
  description: string;
  timeAllocated?: number;
  isComplete: boolean;
  isHidden: boolean;
}
