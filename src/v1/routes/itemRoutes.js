const express = require("express");
const itemController = require("../controllers/itemController");

const router = express.Router();

router.get("/", itemController.getAllItems);

router.get("/:itemId", itemController.getOneItem);

router.post("/", itemController.createNewItem);

router.patch("/:itemId", itemController.updateItem);

router.delete("/:itemId", itemController.deleteItem);

module.exports = router;