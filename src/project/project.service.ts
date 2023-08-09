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
import { UserService } from 'src/user/user.service';
import { IProject } from './interface/project.interface';
import { IProjectMember } from './interface/projectMember.interface';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('Project') private readonly projects: Model<Project>,
    private readonly orgService: OrgService,
    private readonly userService: UserService,
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

  async authorizeUserAccessToProject(
    userId: string,
    projectId: string,
    requiredLevel: string,
  ) {
    const projectDoc = await this.projects.findById(projectId);
    if (!projectDoc) {
      throw new NotFoundException('Project not found.');
    }
    const project = this.projectDoctoIProject(projectDoc);
    const member = await this.getProjectMember(userId, project);
    // the order defines the heirachy eg. admin has all user privilages
    const permissionLevels = ['projectViewer', 'projectUser', 'projectAdmin'];
    const requiredIndex = permissionLevels.indexOf(requiredLevel);
    const userIndex = permissionLevels.indexOf(member.role);
    if (!member || userIndex === -1 || userIndex < requiredIndex) {
      throw new NotFoundException(`You don't have permission.`);
    } else {
      return { projectDoc: projectDoc, member: member };
    }
  }

  private getProjectMember(userId: string, project: IProject): IProjectMember {
    const member = project.members.find(
      (member) => member._id.toString() === userId,
    );
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return member;
  }

  async getProject(userId: string, projectId: string): Promise<IProject> {
    try {
      const { projectDoc } = await this.authorizeUserAccessToProject(
        userId,
        projectId,
        'projectViewer',
      );
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
      // org should already be authorized?
      const org = await this.orgService.getOrg(userId, orgId);
      const member = org.members.find(
        (member) => member._id.toString() === userId,
      );
      if (!member || member.role !== 'orgAdmin') {
        throw new NotFoundException('Organization not found.');
      }
      const user = await this.userService.getUser(userId);
      const formattedProject = new this.projects({
        name: newProject.name,
        creator: new Types.ObjectId(user._id),
        members: [{ _id: user._id, role: 'projectAdmin' }],
        org: new Types.ObjectId(org._id),
        createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
        updatedAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
      });
      const createdProject = await formattedProject.save();
      return this.projectDoctoIProject(createdProject);
    } catch (error) {
      // todo: log error
      throw error;
    }
  }

  async updateProject(
    userId: string,
    projectId: string,
    changes: UpdateProjectDto,
  ): Promise<IProject> {
    try {
      const { projectDoc } = await this.authorizeUserAccessToProject(
        userId,
        projectId,
        'projectAdmin',
      );
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
      const project = await this.getProject(userId, projectId);
      const org = await this.orgService.getOrg(userId, project.org);
      let canDelete = false;
      canDelete = org.members.some((member) => {
        return member._id === userId && member.role === 'orgAdmin';
      });
      if (!canDelete) {
        canDelete = project.members.some((member) => {
          return member._id === userId && member.role === 'projectAdmin';
        });
      }
      if (canDelete) {
        const project = await this.projects.findByIdAndDelete(projectId);
        return this.projectDoctoIProject(project);
      } else {
        throw new UnauthorizedException();
      }
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
