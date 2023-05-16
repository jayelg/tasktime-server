const itemService = require("../services/itemService");

const getAllItems = (req, res) => {
    const allItems = itemService.getAllItems();
    res.send({ status: "OK", data: allItems });
  };
  
  const getOneItem = (req, res) => {
    const item = workoutService.getOneItem();
    res.send("Get an existing item");
  };
  
  const createNewItem = (req, res) => {
    const { body } = req;
    if (
        !body.name ||
        !body.creator
    )
    {
        return;
    }
    const newItem = {
        name: body.name,
        creator: body.creator,
      };
    const createdItem = itemService.createNewItem(newItem);
    res.status(201).send({ status: "OK", data: createdItem });
  };
  
  const updateItem = (req, res) => {
    const updatedItem = itemService.updateItem();
    res.send("Update an existing item");
  };
  
  const deleteItem = (req, res) => {
    itemService.deleteItem();
    res.send("Delete an existing item");
  };
  
  module.exports = {
    getAllItems,
    getOneItem,
    createNewItem,
    updateItem,
    deleteItem,
  };