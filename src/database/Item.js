const DB = require("./db.json");

const getAllItems = () => {
  return DB.items;
};

module.exports = { getAllItems };