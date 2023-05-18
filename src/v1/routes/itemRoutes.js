const express = require("express");
const itemController = require("../controllers/itemController");

const router = express.Router();

router.get("/", itemController.getAllItems);

router.get("/:itemId", itemController.getItem);

router.post("/", itemController.createItem);

router.patch("/:itemId", itemController.updateItem);

router.delete("/:itemId", itemController.deleteItem);

module.exports = router;