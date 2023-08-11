import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './project.schema';
import { Model, Types } from 'mongoose';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { OrgService } from 'src/org/org.service';
import { IProject } from './interface/project.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProjectCreatedEvent } from './event/projectCreated.event';
import { ProjectDeletedEvent } from './event/projectDeleted.event';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('Project') private readonly projects: Model<Project>,
    private readonly orgService: OrgService,
    private eventEmitter: EventEmitter2,
  ) {}

  private projectDoctoIProject(projectDoc: ProjectDocument): IProject {
    const org: IProject = {
      ...projectDoc.toJSON(),
      // convert all objectId types to strings
      _id: projectDoc._id.toString(),
      org: projectDoc.org.toString(),
      members: projectDoc.members.map((member) => ({
        _id: member._id.toString(),
        role: member.role,
      })),
      events: projectDoc.events.map((eventId) => eventId.toString()),
      items: projectDoc.items.map((itemId) => itemId.toString()),
    };
    return org;
  }

  async getProject(projectId: string): Promise<IProject> {
    try {
      const projectDoc = await this.projects.findById(projectId);
      if (!projectDoc) {
        throw new NotFoundException('Project not found.');
      }
      const project = this.projectDoctoIProject(projectDoc);
      return project;
    } catch (error) {
      // todo: log error
      throw error;
    }
  }

  async createProject(
    userId: string,
    orgId: string,
    newProject: CreateProjectDto,
  ): Promise<IProject> {
    try {
      const org = await this.orgService.getOrg(orgId);
      const formattedProject = new this.projects({
        name: newProject.name,
        creator: new Types.ObjectId(new Types.ObjectId(userId)),
        members: [{ _id: new Types.ObjectId(userId), role: 'projectAdmin' }],
        org: new Types.ObjectId(org._id),
        createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
        updatedAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
      });
      const createdProject = await formattedProject.save();
      const project = this.projectDoctoIProject(createdProject);
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
  ): Promise<IProject> {
    try {
      const projectDoc = await this.projects.findById(projectId);
      Object.assign(projectDoc, changes);
      const updatedProject = await projectDoc.save();
      return this.projectDoctoIProject(updatedProject);
    } catch (error) {
      // todo: log error
      throw error;
    }
  }

  // either a orgAdmin or a projectAdmin can delete a project
  async deleteProject(userId: string, projectId: string) {
    try {
      const projectDoc = await this.projects.findByIdAndDelete(projectId);
      const project = this.projectDoctoIProject(projectDoc);
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
      return project;
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
    const projects = projectDocs.map((project) =>
      this.projectDoctoIProject(project),
    );
    // only return projects that user is a member of
    return projects.filter((project) =>
      project.members.some((member) => member._id === userId),
    );
  }
}
