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
    const { name, creator, parentItemId, colour } = req.body;
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
      };
    try {
        const createdItem = await itemService.createItem(projectId, newItem);
        if (createdItem.parentItemId !== "topLevel") {
            const parentItem = await itemService.getItem(projectId, parentItemId);
            const updatedNestedItemIds = [...parentItem.nestedItemIds, createdItem._id];
            await itemService.updateItem(projectId, parentItemId, { nestedItemIds: updatedNestedItemIds });
        }
        res.status(201).send({ status: "OK", data: createdItem });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
};
  
  const updateItem = async (req, res) => {
    const { body, params: { projectId, itemId }, } = req;
    console.log("PATCH request: item");
    if (!projectId || !itemId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: { error: errNoItemId },
      });
    }
    try {
        const updatedItem = await itemService.updateItem(projectId, itemId, body);
        res.send({ status: "OK", data: updatedItem});
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };
  
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
        // Fetch the item and retrieve the parentItemId
        const item = await itemService.getItem(projectId, itemId);
        console.log(item.name + " " + item._id);
        const { parentItemId } = item;
        console.log("parent item ID: " + parentItemId);

  
        // Delete the item
        await itemService.deleteItem(projectId, itemId);

        // Delete each nested item
        const nestedItemIds = item.nestedItemIds.map(objectId => objectId.toString());
        if ( nestedItemIds.length !== 0 ) {
          for (const nestedItemId of nestedItemIds) {
              await itemService.deleteItem(projectId, nestedItemId);
              console.log("removed nested item " + nestedItemId);
          }
        }
  
        // Remove the item from the parent nestedItemIds array
        console.log("out of for loop");
        console.log("parent item ids " + parentItemId);
        if (parentItemId !== "topLevel") {
          console.log("removing item ref from parent...");
            const parentItem = await itemService.getItem(projectId, parentItemId);
            updatedNestedItemIds = parentItem.nestedItemIds.filter(
              (nestedId) => nestedId.toString() !== itemId.toString()
            );
            console.log("updated parentNestedItemIds" + updatedNestedItemIds);
            await itemService.updateItem(projectId, item.parentItemId, {
                nestedItemIds: updatedNestedItemIds,
            });
        } else {
          console.log("parentItemId is top level");
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