import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProjectDeletedEvent } from './event/projectDeleted.event';
import { EntityManager } from '@mikro-orm/postgresql';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ProjectRepository } from './repositories/project.repository';
import { Org } from 'src/api/org/entities/org.entity';
import { User } from 'src/api/user/entities/user.entity';
import { ProjectMember } from './entities/projectMember.entity';
import { ProjectMemberRole } from './enum/projectMemberRole.enum';

@Injectable()
export class ProjectService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Project)
    private readonly projectRepository: ProjectRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async getAllProjects(userId: string): Promise<Record<string, Project[]>> {
    try {
      const projectMembers =
        await this.projectRepository.findProjectsByMemberId(userId);
      const projectRefs = projectMembers.map(
        (projectMember) => projectMember.project,
      );
      const projects = await this.projectRepository.find(projectRefs);

      const projectsByOrg: Record<string, Project[]> = {};
      projects.forEach((project) => {
        const orgId = project.org.id; // assuming 'org' is a field in Project entity that has an 'id' field
        if (!projectsByOrg[orgId]) {
          projectsByOrg[orgId] = [];
        }
        projectsByOrg[orgId].push(project);
      });

      return projectsByOrg;
    } catch (error) {
      throw error;
    }
  }

  async getProject(projectId: string): Promise<Project> {
    try {
      return await this.projectRepository.findOne(projectId);
    } catch (error) {
      throw error;
    }
  }

  async createProject(
    userId: string,
    newProject: CreateProjectDto,
  ): Promise<Project> {
    try {
      const userRef = this.em.getReference(User, userId);
      const orgRef = this.em.getReference(Org, newProject.orgId);
      const project = new Project(userRef, orgRef, newProject.name);
      await this.em.persistAndFlush(project);
      const projectRef = this.em.getReference(Project, project.id);
      const projectMember = new ProjectMember(
        userRef,
        projectRef,
        ProjectMemberRole.Admin,
      );
      await this.em.persistAndFlush(projectMember);
      return project;
    } catch (error) {
      throw error;
    }
  }

  async updateProject(
    projectId: string,
    updates: UpdateProjectDto,
  ): Promise<Project> {
    try {
      const project = await this.projectRepository.findOne(projectId);
      this.projectRepository.assign(project, updates);
      return project;
    } catch (error) {
      throw error;
    }
  }

  async deleteProject(userId: string, projectId: string): Promise<undefined> {
    try {
      const projectMembers =
        await this.projectRepository.findMembersByProjectId(projectId);
      await this.em.removeAndFlush(projectMembers);
      const project = await this.projectRepository.findOne(projectId);
      if (!project) {
        throw new Error(`Project with ID ${projectId} not found`);
      }
      await this.em.removeAndFlush(project);

      this.eventEmitter.emit(
        'project.deleted',
        new ProjectDeletedEvent(
          project.id,
          project.name,
          project.org.id,
          new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
          userId,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async getMember(userId: string, projectId: string): Promise<ProjectMember> {
    return await this.projectRepository.findProjectMember(userId, projectId);
  }
}
