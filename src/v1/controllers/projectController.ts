import { Request, Response } from "express";
const projectService = require("../services/projectService");
const errNoProjectId = "No projectId - A project Id is required to get an project";

const getAllProjectsController = async (req: Request, res: Response) => {
    console.log("GET request: All Projects");
    try {
        const allProjects = await projectService.getAllProjects();
        res.send({ status: "OK", data: allProjects });
    } catch (error: any) {
        res
            .status(error.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error} });
    }
    
  };
  
  const getProjectController = async (req: Request, res: Response) => {
    const { params: { projectId }, } = req;
    console.log("GET request: project");
    if (!projectId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: { error: errNoProjectId}
            })
    }
    try {
        const project = await projectService.getProject(projectId);
        res.send({ status: "OK", data: project });
    } catch (error: any) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };
  
  const createProjectController = async (req: Request, res: Response) => {
    const { body } = req;
    console.log("POST request: New Project");
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
    const newProject = {
        name: body.name,
        creator: body.creator,
      };
    try {
        const createdProject = await projectService.createProject(newProject);
        res.status(201).send({ status: "OK", data: createdProject });
    } catch (error: any) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
};
  
  const updateProjectController = async (req: Request, res: Response) => {
    const { body, params: { projectId }, } = req;
    console.log("PATCH request: project");
    if (!projectId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: { error: errNoProjectId },
      });
    }
    try {
        const updatedProject = await projectService.updateProject(projectId, body);
        res.send({ status: "OK", data: updatedProject});
    } catch (error: any) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };
  
  const deleteProjectController = async (req: Request, res: Response) => {
    console.log("DELETE request: project");
    const { params: { projectId }, } = req;
    if (!projectId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: { error: errNoProjectId },
      });
    }
    try {
    await projectService.deleteProject(projectId);
    res.status(204).send({status: "OK"});
    } catch (error: any) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };
  
  module.exports = {
    getAllProjectsController,
    getProjectController,
    createProjectController,
    updateProjectController,
    deleteProjectController,
  };