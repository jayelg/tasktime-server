import { Schema, model } from 'mongoose';
import { Project, Item } from '../v1/types';

const itemSchema = new Schema<Item>({
    projectId: {
        required: true,
        type: Schema.Types.ObjectId
    },
    name: {
        required: true,
        type: String,
        default: "New Item"
    },
    creator: {
        required: true,
        type: String
    },
    createdAt: {
        required: true,
        type: String
    },
    updatedAt: {
        required: true,
        type: String
    },
    description: {
        required: false,
        type: String
    },
    members: {
        required: true,
        type: [Schema.Types.ObjectId],
        default: []
    },
    timeAllocated: {
        required: false,
        type: Number
    },
    timeSpent: {
        required: true,
        type: Number,
        default: 0
    },
    isComplete: {
        required: true,
        type: Boolean,
        default: false
    },
    reqReview: {
        required: true,
        type: Boolean,
        default: false
    },
    reviewers: {
        required: false,
        type: [Schema.Types.ObjectId]
    },
    reviewState: {
        required: false,
        type: String
    },
    colour: {
        required: true,
        type: String
    },
    nestedItemIds: {
        required: true,
        type: [Schema.Types.ObjectId],
        default: []
    },
    parentItemId: {
    required: true,
        type: Schema.Types.ObjectId,
        default: "topLevel"
    },
    predecessorItemIds: {
        required: true,
        type: [Schema.Types.ObjectId],
        default: []
    },
    successorItemIds: {
        required: true,
        type: [Schema.Types.ObjectId],
        default: []
    },
    itemObjects: {
        required: true,
        type: [Object],
        default: []
    }
})

const projectSchema = new Schema<Project>({
    name: {
        required: true,
        type: String,
        default: "New Project"
    },
    creator: {
        required: true,
        type: String
    },
    createdAt: {
        required: true,
        type: String
    },
    updatedAt: {
        required: true,
        type: String
    },
    description: {
        required: false,
        type: String
    },
    members: {
        required: true,
        type: [String],
        default: []
    },
    timeAllocated: {
        required: false,
        type: Number
    },
    isComplete: {
        required: true,
        type: Boolean,
        default: false
    },
    items: {
        required: true,
        type: [itemSchema],
        default: [],
        of: itemSchema,
    }
})

const ProjectModel = model('Project', projectSchema);
const ItemModel = model('Item', itemSchema);

module.exports = {
    ProjectModel,
    ItemModel
};