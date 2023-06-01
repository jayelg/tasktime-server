import { Types } from 'mongoose';

export interface Item {
    _id: Types.ObjectId,
    projectId: Types.ObjectId,
    name: string,
    creator: string,
    createdAt: string,
    updatedAt: string,
    description?: string,
    members: Types.ObjectId[],
    timeAllocated?: number,
    timeSpent: number,
    isComplete: boolean,
    reqReview: boolean,
    reviewers?: Types.ObjectId[],
    reviewState?: string,
    colour: string,
    nestedItemIds: Types.ObjectId[],
    parentItemId: Types.ObjectId,
    predecessorItemIds: Types.ObjectId[],
    successorItemIds: Types.ObjectId[],
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