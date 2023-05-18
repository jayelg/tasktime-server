const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    colour: {
        required: true,
        type: String
    },
    tasks: {
        required: true,
        type: Array,
        default: []
    }
});

const itemSchema = new mongoose.Schema({
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
        type: Array,
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
    reviewer: {
        required: false,
        type: String
    },
    reviewState: {
        required: false,
        type: String
    },
    parentDependencies: {
        required: true,
        type: Array,
        default: []
    },
    childDependencies: {
        required: true,
        type: Array,
        default: []
    },
    objects: {
        required: true,
        type: Array,
        default: []
    },
    streams: {
        required: true,
        type: Object,
        default: {},
        of: streamSchema
    }
})

const projectSchema = new mongoose.Schema({
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
        type: Array,
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
        type: Array,
        default: [],
        of: itemSchema
    }
})

const ProjectModel = mongoose.model('Project', projectSchema);
const ItemModel = mongoose.model('Item', itemSchema);

module.exports = {
    ProjectModel,
    ItemModel
};