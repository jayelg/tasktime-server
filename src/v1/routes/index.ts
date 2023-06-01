const projectController = require("../controllers/projectController");
const itemController = require("../controllers/itemController");
import { Router } from 'express';
const router = Router();


// Project routes

router.get("/", projectController.getAllProjectsController);

router.get("/:projectId", projectController.getProjectController);

router.post("/", projectController.createProjectController);

router.patch("/:projectId", projectController.updateProjectController);

router.delete("/:projectId", projectController.deleteProjectController);

// Item routes

router.get("/:projectId/items/", itemController.getAllItemsController);

router.get("/:projectId/items/:itemId", itemController.getItemController);

router.post("/:projectId/items/", itemController.createItemController);

router.patch("/:projectId/items/:itemId", itemController.updateItemController);

router.delete("/:projectId/items/:itemId", itemController.deleteItemController);

// temp for testing

router.delete("/:projectId/deleteitems/", itemController.deleteAllItemsController);


module.exports = router;