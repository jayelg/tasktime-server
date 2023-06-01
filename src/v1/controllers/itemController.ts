import { Request, Response } from "express";
import { Types } from 'mongoose';
const itemService = require("../services/itemService");

const checkRequest = (requiredProps: string[], request: any, allowedProps: string[] = []) => {
  let missingProps = [];
  let invalidProps = [];
  for (const property of requiredProps) {
    if (!request.hasOwnProperty(property) || !request[property]) {
      missingProps.push(property);
    }
  }
  if (allowedProps.length > 0) {
    for (const property in request) {
      if (!allowedProps.includes(property)) {
        invalidProps.push(property);
      }
    }
  }
  if (missingProps.length > 0 || invalidProps.length > 0) {
    throw new Error(
      (missingProps.length > 0 ? "The following properties are missing: " + missingProps.join(", ") + ". " : "") +
      (invalidProps.length > 0 ? "The following properties are either not valid or cannot be modified: " + invalidProps.join(", ") + "." : "")
    );
  }
}

const getAllItemsController = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const allItems = await itemService.getAllItems(projectId);
    res.send({ status: "OK", data: allItems });
  } catch (error: any) {
    res.status(error.status || 500).send({ status: "FAILED", data: { error: error?.message || error} });
  }  
};
  
const getItemController = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { itemId } = req.params;
  console.log("GET request: item");
  const requiredProps = ["projectId","itemId"];
  checkRequest(requiredProps, {projectId: projectId, itemId: itemId});
  try {
    const item = await itemService.getItem(projectId, itemId);
    res.send({ status: "OK", data: item });
  } catch (error: any) {
      res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};
  

  // checks for correct parameters in req.body
  // creates a newItem
  // if it isn't a top level item then it will add the new item to the nestedItemIds property of its parent
const createItemController = async (req: Request, res: Response) => {
  const requiredProps = ["projectId","name","creator","colour","parentItemId"];
  const { projectId } = req.params;
  const newItem = {
    projectId: req.params.projectId,
    name: req.body.name,
    creator: req.body.creator,
    colour: req.body.colour,
    parentItemId: req.body.parentItemId,
    predecessorItemIds: req.body.predecessorItemIds // optional
      ? req.body.predecessorItemIds
      : [],
  };
  try {
    checkRequest(requiredProps, newItem); 
    const createdItem = await itemService.createItem(projectId, newItem);;
    // handle nested item relationships
    if (newItem.parentItemId !== projectId) {
      console.log("parent not top level");
      const parentItem = await itemService.getItem(projectId, newItem.parentItemId);
      const updatedNestedItemIds = { nestedItemIds: [...parentItem.nestedItemIds, createdItem._id] };
      // everything working up to here for direct http request but not axios??
      console.log("new Item from Db " + createdItem);
      const parentUpdate = await itemService.updateItem(projectId, newItem.parentItemId, updatedNestedItemIds);
      console.log("updated parent item from db " + parentUpdate);
    }
    // handle predecessor/successor item relationships
    if (createdItem.predecessorItemIds.length !== 0) {
      console.log("item has predecessor.");
      for (let predecessorItemId of createdItem.predecessorItemIds) {
        const predecessorItem = await itemService.getItem(projectId, predecessorItemId);
        const updatedSuccessorItemIds = [...predecessorItem.successorItemIds, createdItem._id];
        await itemService.updateItem(projectId, predecessorItemId, { successorItemIds: updatedSuccessorItemIds });
      }
    }
    console.log("add item complete");
    res.status(201).send({ status: "OK", data: createdItem });
  } catch (error: any) {
      res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};
  
const updateItemController = async (req: Request, res: Response) => {
  try {
    const requiredProps = ["projectId", "itemId"];
    const allowedProps = ["projectId", "itemId", "parentItemId", "name"];
    const { projectId, itemId } = req.params;
    const { body } = req;
    checkRequest(requiredProps, {projectId: projectId, itemId: itemId, ...body}, allowedProps);
    // Fetch the item
    const item = await itemService.getItem(projectId, itemId);
    
    // paretenItemId validation
    const { parentItemId } = item;
    if (body.parentItemId === parentItemId) {
      res.status(400).send({ // could this fail gracefully?
        status: "FAILED",
        data: { error: "The provided 'parentItemId' value is the same as the current parent." },
      });
      return;
    }

    // parentItemId - updating relationships
    // Remove the item from the old parent's nestedItemIds array
    if (parentItemId !== projectId) {
      const parentItem = await itemService.getItem(projectId, parentItemId);
      const updatedNestedItemIds = parentItem.nestedItemIds.filter(
        (nestedId: Types.ObjectId) => nestedId.toString() !== itemId.toString()
      );
      await itemService.updateItem(projectId, parentItemId, {
        nestedItemIds: updatedNestedItemIds,
      });
    }
    // Add the item to the new parent's nestedItemIds array
    if (body.parentItemId && body.parentItemId !== projectId) {
      const newParentItem = await itemService.getItem(projectId, body.parentItemId);
      const updatedNestedItemIds = [
        ...newParentItem.nestedItemIds,
        itemId,
      ];
      await itemService.updateItem(projectId, body.parentItemId, {
        nestedItemIds: updatedNestedItemIds,
      });
    }

    // Update all item properties provided
    const updatedItem = await itemService.updateItem(projectId, itemId, body);

    res.send({ status: "OK", data: updatedItem });
  } catch (error: any) {
    res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};
  
  // todo remove successorItemIds from predecessors
  const deleteItemController = async (req: Request, res: Response) => {
    const requiredProps = ["projectId", "itemId"];
    const { projectId, itemId } = req.params;
    try {
      checkRequest(requiredProps, {projectId: projectId, itemId: itemId})
      // Get Item from db
      const item = await itemService.getItem(projectId, itemId);
      const { parentItemId } = item;
      // Remove item from db
      await itemService.deleteItem(projectId, itemId);
      // Remove each item nested under item from db
      const nestedItemIds = item.nestedItemIds.map((itemId: Types.ObjectId) => itemId.toString());
      if ( nestedItemIds.length !== 0 ) {
        for (const nestedItemId of nestedItemIds) {
          await itemService.deleteItem(projectId, nestedItemId);
        }
      }
      // Remove the item from the parent nestedItemIds array
      if (parentItemId !== projectId) {
        const parentItem = await itemService.getItem(projectId, parentItemId);
        const updatedNestedItemIds = parentItem.nestedItemIds.filter(
          (nestedId: Types.ObjectId) => nestedId.toString() !== itemId.toString()
        );
        await itemService.updateItem(projectId, item.parentItemId, {
          nestedItemIds: updatedNestedItemIds,
        });
      }
      res.status(204).send({ status: "OK" });
    } catch (error: any) {
      res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };

  const deleteAllItemsController = async (req: Request, res: Response) => {
    console.log("Delete all items request.");
    const { params: { projectId } } = req;
    await itemService.deleteAllItems(projectId);
    res.status(204).send({ status: "OK" });
  }

  module.exports = {
    getAllItemsController,
    getItemController,
    createItemController,
    updateItemController,
    deleteItemController,
    deleteAllItemsController,
  };