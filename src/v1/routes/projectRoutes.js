const express = require("express");
const projectController = require("../controllers/projectController");

const router = express.Router();

router.get("/", projectController.getAllProjects);

router.get("/:projectId", projectController.getProject);

router.post("/", projectController.createProject);

router.patch("/:projectId", projectController.updateProject);

router.delete("/:projectId", projectController.deleteProject);

module.exports = router;