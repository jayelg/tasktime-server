const { ProjectModel, ItemModel } = require('../../models/projectModel');
const { ObjectId } = require('mongodb');
import { Item } from '../types/';

const findProject = async (projectId: string) => {
  const project = await ProjectModel.findById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }
  return project;
}

const getAllItems = async (projectId: string) => {
  let project = await findProject(projectId);
  return project.items;
};
  
  const getItem = async (projectId: string, itemId: string) => {
    let project = await findProject(projectId);
    const item = project.items.id(itemId);
    if (!item) {
      throw new Error('Get Item: Item not found');
    }
    console.log(item);
    return item;
  };
  
  // all _id ObjectId type formatting is done here just before interfacing with db.
  const createItem = async (projectId: string, newItem: Item) => {
    let project = await findProject(projectId);
    const formattedItem = new ItemModel({
        projectId: newItem.projectId,
        name: newItem.name,
        creator: newItem.creator,
        colour: newItem.colour,
        parentItemId: newItem.parentItemId,
        predecessorItemIds: newItem.predecessorItemIds,
        createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    });

    project.items.push(formattedItem);

    try {
      await project.save();
      return formattedItem;
    } catch (error) {
        throw error;
    }
  };
  
  const updateItem = async (projectId: string, itemId: string, changes: Object) => {
    const project = await findProject(projectId);
    const item = project.items.id(itemId);

    if (!item) {
      throw new Error('Update: Item not found');
    }
    
    item.set(changes);
  
    try {
      console.log("returned updated item //////");
      console.log(await project.save());
      return item;
    } catch (error) {
      throw error;
    }
  };
  
  const deleteItem = async (projectId: string, itemId: string) => {
    const project = await findProject(projectId);
    const itemIndex = project.items.findIndex((item: Item) => item._id.toString() === itemId);
    if (itemIndex === -1) {
      throw new Error('Delete: Item not found');
    }
    project.items.splice(itemIndex, 1);
    try {
      await project.save();
    } catch (error) {
      throw error;
    }
  };

  const deleteAllItems = async (projectId: string) => {
    const project = await findProject(projectId);
    project.items = [];
    await project.save();
  }
  
  module.exports = {
    getAllItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    deleteAllItems,
  };