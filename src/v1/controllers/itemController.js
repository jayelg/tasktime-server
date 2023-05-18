const itemService = require("../services/itemService");

const errNoItemId = "No itemId - An item Id is required to get an item";

const getAllItems = (req, res) => {
    console.log("GET request: All Items");
    try {
        const allItems = itemService.getAllItems();
        res.send({ status: "OK", data: allItems });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error} });
    }
    
  };
  
  const getItem = (req, res) => {
    const { params: { itemId }, } = req;
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
        const item = itemService.getItem(itemId);
        res.send({ status: "OK", data: item });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };
  
  const createItem = (req, res) => {
    const { body } = req;
    console.log("POST request: New Item");
    if ( !body.name || !body.creator )   {
        res
            .status(400)
            .send({
            status: "FAILED",
            data: {
                error:
                "One of the following properties is missing or is empty in request body: 'name', 'creator'",
            },
        });
        return;
    }
    const newItem = {
        name: body.name,
        creator: body.creator,
      };
    try {
        const createdItem = itemService.createItem(newItem);
        res.status(201).send({ status: "OK", data: createdItem });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
};
  
  const updateItem = (req, res) => {
    const { body, params: { itemId }, } = req;
    console.log("PATCH request: item");
    if (!itemId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: { error: errNoItemId },
      });
    }
    try {
        const updatedItem = itemService.updateItem(itemId, body);
        res.send({ status: "OK", data: updatedItem});
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };
  
  const deleteItem = (req, res) => {
    console.log("DELETE request: item");
    const { params: { itemId }, } = req;
    if (!itemId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: { error: errNoItemId },
      });
    }
    try {
    itemService.deleteItem(itemId);
    res.status(204).send({status: "OK"});
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };
  
  module.exports = {
    getAllItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
  };