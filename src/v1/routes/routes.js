const express = require("express");
const projectController = require("../controllers/projectController");
const itemController = require("../controllers/itemController");

const router = express.Router();

// Project routes

router.get("/", projectController.getAllProjects);

router.get("/:projectId", projectController.getProject);

router.post("/", projectController.createProject);

router.patch("/:projectId", projectController.updateProject);

router.delete("/:projectId", projectController.deleteProject);

// Item routes

router.get("/:projectId/items/", itemController.getAllItems);

router.get("/:projectId/items/:itemId", itemController.getItem);

router.post("/:projectId/items/", itemController.createItem);

router.patch("/:projectId/items/:itemId", itemController.updateItem);

router.delete("/:projectId/items/:itemId", itemController.deleteItem);

// temp for testing

router.delete("/:projectId/deleteitems/", itemController.deleteAllItems);


module.exports = router;