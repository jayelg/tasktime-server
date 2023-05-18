const projectService = require("../services/projectService");

const errNoProjectId = "No projectId - A project Id is required to get an project";

const getAllProjects = async (req, res) => {
    console.log("GET request: All Projects");
    try {
        const allProjects = await projectService.getAllProjects();
        res.send({ status: "OK", data: allProjects });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error} });
    }
    
  };
  
  const getProject = async (req, res) => {
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
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };
  
  const createProject = async (req, res) => {
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
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
};
  
  const updateProject = async (req, res) => {
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
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };
  
  const deleteProject = async (req, res) => {
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
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };
  
  module.exports = {
    getAllProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
  };