export interface IItem {
  _id: string;
  project: string;
  name: string;
  creator: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  allocatedTo: string[];
  timeAllocated: number;
  timeSpent: number;
  isComplete: boolean;
  reqReview: boolean;
  reviewers: string[];
  colour: string;
  nestedItemIds: string[];
  parentItemId: string;
  predecessorItemId: string;
  successorItemId: string;
  itemObjects: object;
}
