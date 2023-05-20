const { ProjectModel, ItemModel } = require('../../models/projectModel');
const mongoose = require('mongoose');

const findProject = async (projectId) => {
  const project = await ProjectModel.findById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }
  return project;
}

const getAllItems = async (projectId) => {
  let project = await findProject(projectId);
  return project.items;
};
  
  const getItem = async (projectId, itemId) => {
    let project = await findProject(projectId);
    const item = project.items.find((item) => item._id.toString() === itemId);
    if (!item) {
      throw new Error('Get Item: Item not found');
    }
    return item;
  };
  
  const createItem = async (projectId, newItem) => {
    let project = await findProject(projectId);
    const formattedItem = new ItemModel({
        name: newItem.name,
        creator: newItem.creator,
        colour: newItem.colour,
        parentItemId: newItem.parentItemId,
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
  
  const updateItem = async (projectId, itemId, changes) => {
    const project = await findProject(projectId);
    const item = project.items.find((item) => item._id.toString() === itemId);
  
    if (!item) {
      throw new Error('Update: Item not found');
    }
  
    Object.assign(item, changes);
  
    try {
      await project.save();
      return item;
    } catch (error) {
      throw error;
    }
  };
  
  const deleteItem = async (projectId, itemId) => {
    const project = await findProject(projectId);
    const itemIndex = project.items.findIndex((item) => item._id.toString() === itemId);
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

  const deleteAllItems = async (projectId) => {
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