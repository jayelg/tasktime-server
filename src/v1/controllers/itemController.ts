import { Request, Response } from "express";
import { Types } from 'mongoose';
const itemService = require("../services/itemService");

// todo - move to ../errors/index.ts
const errNoItemId = "No itemId - An item Id is required to get an item";

const checkRequest = (whiteList: string[], request: any) => { // request type should be an object with properties of any type can it be less permissive?
  let missingItems = [];
  for (const property of whiteList) {
    if (!request.hasOwnProperty(property) || !request[property]) {
      missingItems.push(property);
    }
  }
  if (missingItems.length > 0) {
    throw new Error("The following properties are missing: " + missingItems.join(", "));
  }
}

const getAllItemsController = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const allItems = await itemService.getAllItems(projectId);
        res.send({ status: "OK", data: allItems });
    } catch (error: any) {
      console.log(error);
        res
            .status(error.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error} });
    }
    
};
  
const getItemController = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { itemId } = req.params;
  console.log("GET request: item");
  const whiteList = ["projectId","itemId"];
  checkRequest(whiteList, {projectId: projectId, itemId: itemId});
  if (!itemId) {
     res
            .status(400)
            .send({
                status: "FAILED",
                data: { error: errNoItemId}
            })
    }
    try {
        const item = await itemService.getItem(projectId, itemId);
        res.send({ status: "OK", data: item });
    } catch (error: any) {
      console.log(error);
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };
  

  // checks for correct parameters in req.body
  // creates a newItem
  // if it isn't a top level item then it will add the new item to the nestedItemIds property of its parent
  const createItemController = async (req: Request, res: Response) => {
    console.log(req.body.parentItemId);
    const whiteList = ["projectId","name","creator","colour"];
    const newItem = {
      projectId: new Types.ObjectId(req.params.projectId),
      name: req.body.name,
      creator: req.body.creator,
      colour: req.body.colour,
      parentItemId: new Types.ObjectId(req.body.parentItemId),
      predecessorItemIds: Array.isArray(req.body.predecessorItemIds)
        ? req.body.predecessorItemIds.map((id: string) => new Types.ObjectId(id))
        : [],
    };
    console.log(newItem);
    try {
      checkRequest(whiteList, newItem); 
      const createdItem = await itemService.createItem(newItem.projectId, newItem);
      // handle nested item relationships
      if (newItem.parentItemId.equals(newItem.projectId)) {
        console.log("parent not top level");
        const parentItem = await itemService.getItem(newItem.projectId, newItem.parentItemId);
        const updatedNestedItemIds = { nestedItemIds: [...parentItem.nestedItemIds, createdItem._id] };
        // everything working up to here for direct http request but not axios??
        console.log("new Item from Db " + createdItem);
        const parentUpdate = await itemService.updateItem(newItem.projectId, newItem.parentItemId, updatedNestedItemIds);
        console.log("updated parent item from db " + parentUpdate);
      }
      // handle predecessor/successor item relationships
      if (createdItem.predecessorItemIds.length !== 0) {
        console.log("item has predecessor.");
        for (let predecessorItemId of createdItem.predecessorItemIds) {
          const predecessorItem = await itemService.getItem(newItem.projectId, predecessorItemId);
          const updatedSuccessorItemIds = [...predecessorItem.successorItemIds, createdItem._id];
          const updatedParent = await itemService.updateItem(newItem.projectId, predecessorItemId, { successorItemIds: updatedSuccessorItemIds });
        }
      }
      console.log("add item complete");
      res.status(201).send({ status: "OK", data: createdItem });
  } catch (error: any) {
      console.log(error);
      res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
  }
};
  
const updateItemController = async (req: Request, res: Response) => {
  if (!req.params.projectId || !req.params.itemId) {
    res.status(400).send({
      status: "FAILED",
      data: { error: errNoItemId },
    });
  }
  try {
    const projectId = new Types.ObjectId(req.params.projectId);
    const itemId = new Types.ObjectId(req.params.itemId);
    const { body } = req;
    // blocks none whitelisted parameters
    if (!body.parentItemId && !body.name) {
      console.log("failed whitelist");
      res.status(400).send({
        status: "FAILED",
        data: { error: "You must provide valid properties in the request body to update the item." },
      });
      return;
    }

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
    if (parentItemId !== "topLevel") {
      const parentItem = await itemService.getItem(projectId, parentItemId);
      const updatedNestedItemIds = parentItem.nestedItemIds.filter(
        (nestedId: Types.ObjectId) => nestedId.toString() !== itemId.toString()
      );
      await itemService.updateItem(projectId, parentItemId, {
        nestedItemIds: updatedNestedItemIds,
      });
    }
    // Add the item to the new parent's nestedItemIds array
    if (body.parentItemId && body.parentItemId !== "topLevel") {
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
    console.log(error);
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};
  
  // todo remove successorItemIds from predecessors
  const deleteItemController = async (req: Request, res: Response) => {
    console.log("DELETE request: item");
    const {
      params: { projectId, itemId },
    } = req;
  
    if (!itemId) {
      res.status(400).send({
        status: "FAILED",
        data: { error: errNoItemId },
      });
    }
    try {
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
        if (parentItemId !== "topLevel") {
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
      console.log(error);
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
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