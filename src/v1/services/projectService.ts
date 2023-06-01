const { ProjectModel } = require('../../models/projectModel');
import { Project } from '../types/';

const getAllProjects = async () => {
    try {
        const allProjects = await ProjectModel.find();
        return allProjects;
    } catch (error) {
        throw error;
    }
  };
  
  const getProject = async (projectId: String) => {
    try {
        const project = await ProjectModel.findById(projectId);
        if (!project) {
          throw new Error("Project not found.");
        }
        return project;
    } catch (error) {
        throw error;
    }
  };
  
  const createProject = async (newProject: Project) => {
    const formattedProject = new ProjectModel({
        name: newProject.name,
        creator: newProject.creator,
        createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
      });
    try {
      const createdProject = await formattedProject.save();
      console.log("created project:");
      console.log(createdProject);
      return createdProject;
    } catch (error) {
        throw error;
    }
  };
  
  const updateProject = async (projectId: String, changes: Object) => {
    try {
        const updatedProject = await ProjectModel.findByIdAndUpdate(projectId, changes, { new: true });
        return updatedProject;
    } catch (error) {
        throw error;
    }
  };
  
  const deleteProject = async (projectId: String) => {
    try {
      await ProjectModel.findByIdAndDelete(projectId);
    } catch (error) {
      throw error;
    }
  };
  
  module.exports = {
    getAllProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
  };