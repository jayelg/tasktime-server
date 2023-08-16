import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './project.schema';
import { Model, Types } from 'mongoose';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { IProject } from './interface/project.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProjectCreatedEvent } from './event/projectCreated.event';
import { ProjectDeletedEvent } from './event/projectDeleted.event';
import { ProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('Project') private readonly projects: Model<Project>,
    private eventEmitter: EventEmitter2,
  ) {}

  async getProject(projectId: string): Promise<ProjectDto> {
    try {
      return new ProjectDto(await this.projects.findById(projectId));
    } catch (error) {
      // todo: log error
      throw error;
    }
  }

  async createProject(
    userId: string,
    orgId: string,
    newProject: CreateProjectDto,
  ): Promise<ProjectDto> {
    try {
      const formattedProject = new this.projects({
        name: newProject.name,
        creator: new Types.ObjectId(new Types.ObjectId(userId)),
        members: [{ _id: new Types.ObjectId(userId), role: 'projectAdmin' }],
        org: new Types.ObjectId(orgId),
        createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
        updatedAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
      });
      const project = new ProjectDto(await formattedProject.save());
      this.eventEmitter.emit(
        'project.created',
        new ProjectCreatedEvent(
          project._id,
          project.name,
          project.org,
          project.createdAt,
          userId,
        ),
      );
      return project;
    } catch (error) {
      // todo: log error
      throw error;
    }
  }

  async updateProject(
    projectId: string,
    changes: UpdateProjectDto,
  ): Promise<ProjectDto> {
    try {
      const projectDoc = await this.projects.findById(projectId);
      Object.assign(projectDoc, changes);
      return new ProjectDto(await projectDoc.save());
    } catch (error) {
      // todo: log error
      throw error;
    }
  }

  // either a orgAdmin or a projectAdmin can delete a project
  async deleteProject(userId: string, projectId: string) {
    try {
      const project = new ProjectDto(
        await this.projects.findByIdAndDelete(projectId),
      );
      this.eventEmitter.emit(
        'project.deleted',
        new ProjectDeletedEvent(
          project._id,
          project.name,
          project.org,
          new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
          userId,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  // needs to check auth
  async getSelectedProjects(
    userId: string,
    projectIds: string[],
  ): Promise<IProject[]> {
    const projectDocs = await this.projects
      .find({ _id: { $in: projectIds } })
      .exec();
    const projects = projectDocs.map((project) => new ProjectDto(project));
    // only return projects that user is a member of
    return projects.filter((project) =>
      project.members.some((member) => member._id === userId),
    );
  }
}
