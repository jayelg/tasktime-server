import { Types } from 'mongoose';

export interface Item {
    _id: Types.ObjectId,
    projectId: string,
    name: string,
    creator: string,
    createdAt: string,
    updatedAt: string,
    description?: string,
    members: string[],
    timeAllocated?: number,
    timeSpent: number,
    isComplete: boolean,
    reqReview: boolean,
    reviewers?: string[],
    reviewState?: string,
    colour: string,
    nestedItemIds: string[],
    parentItemId: string,
    predecessorItemIds: string[],
    successorItemIds: string[],
    itemObjects: ItemObject[]
}

export interface ItemObject {
    type: string,
    data: any
}

export interface Project {
    _id: Types.ObjectId,
    name: string,
    creator: string,
    createdAt: string,
    updatedAt: string,
    description?: string,
    members: string[],
    timeAllocated?: number,
    isComplete: boolean,
    items: Item[]
}