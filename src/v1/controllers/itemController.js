const itemService = require("../services/itemService");

const errNoItemId = "No itemId - An item Id is required to get an item";

const getAllItems = async (req, res) => {
    try {
        const { params: { projectId } } = req;
        const allItems = await itemService.getAllItems(projectId);
        res.send({ status: "OK", data: allItems });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error} });
    }
    
  };
  
  const getItem = async (req, res) => {
    const { params: { projectId, itemId } } = req;
    console.log("GET request: item");
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
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };
  

  // checks for correct parameters in req.body
  // creates a newItem
  // if it isn't a top level item then it will add the new item to the nestedItemIds property of its parent
  const createItem = async (req, res) => {
    const { params: { projectId } } = req;
    const { name, creator, parentItemId, colour, predecessorItemIds } = req.body;
    if ( !name || !creator || !colour )   {
        res
            .status(400)
            .send({
            status: "FAILED",
            data: {
                error:
                "One of the following properties is missing or is empty in request body: 'name', 'creator', 'colour'",
            },
        });
        return;
    }
    const newItem = {
        name: name,
        creator: creator,
        colour: colour,
        parentItemId: parentItemId,
        predecessorItemIds: predecessorItemIds,
      };
    try {
        const createdItem = await itemService.createItem(projectId, newItem);
        // handle nested item relationships
        if (createdItem.parentItemId !== "topLevel") {
            const parentItem = await itemService.getItem(projectId, parentItemId);
            const updatedNestedItemIds = [...parentItem.nestedItemIds, createdItem._id];
            await itemService.updateItem(projectId, parentItemId, { nestedItemIds: updatedNestedItemIds });
        }
        // handle predecessor/successor item relationships
        if (createdItem.predecessorItemIds.length !== 0) {
          console.log("item has predecessor.");
          for (let predecessorItemId of createdItem.predecessorItemIds) {
            const predecessorItem = await itemService.getItem(projectId, predecessorItemId);
            const updatedSuccessorItemIds = [...predecessorItem.successorItemIds, createdItem._id];
            console.log("for: " + predecessorItemId);
            await itemService.updateItem(projectId, predecessorItemId, { successorItemIds: updatedSuccessorItemIds });
          }
        }
        res.status(201).send({ status: "OK", data: createdItem });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
};
  
const updateItem = async (req, res) => {
  const {
    body,
    params: { projectId, itemId },
  } = req;
  console.log("PATCH request: item");
  console.log(req.body);
  if (!projectId || !itemId) {
    res.status(400).send({
      status: "FAILED",
      data: { error: errNoItemId },
    });
  }
  try {
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
        (nestedId) => nestedId.toString() !== itemId.toString()
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
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};
  
  // todo remove successorItemIds from predecessors
  const deleteItem = async (req, res) => {
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
        const nestedItemIds = item.nestedItemIds.map(objectId => objectId.toString());
        if ( nestedItemIds.length !== 0 ) {
          for (const nestedItemId of nestedItemIds) {
              await itemService.deleteItem(projectId, nestedItemId);
          }
        }
        // Remove the item from the parent nestedItemIds array
        if (parentItemId !== "topLevel") {
            const parentItem = await itemService.getItem(projectId, parentItemId);
            updatedNestedItemIds = parentItem.nestedItemIds.filter(
              (nestedId) => nestedId.toString() !== itemId.toString()
            );
            await itemService.updateItem(projectId, item.parentItemId, {
                nestedItemIds: updatedNestedItemIds,
            });
        }
    res.status(204).send({ status: "OK" });
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };

  const deleteAllItems = async (req, res) => {
    console.log("Delete all items request.");
    const { params: { projectId } } = req;
    await itemService.deleteAllItems(projectId);
    res.status(204).send({ status: "OK" });
  }

  module.exports = {
    getAllItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    deleteAllItems,
  };