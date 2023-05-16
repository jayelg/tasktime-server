const { v4: uuid } = require("uuid");
const Item = require("../../database/Item");


const getAllItems = () => {
    const allItems = Item.getAllItems();
    return allItems;
  };
  
  const getOneItem = () => {
    return;
  };
  
  const createNewItem = () => {
    const itemToInsert = {
        ...newItem,
        id: uuid(),
        createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
      };
    const createdItem = Item.createNewItem(itemToInsert);
    return createdItem;
  };
  
  const updateOneItem = () => {
    return;
  };
  
  const deleteOneItem = () => {
    return;
  };
  
  module.exports = {
    getAllItems,
    getOneItem,
    createNewItem,
    updateOneItem,
    deleteOneItem,
  };