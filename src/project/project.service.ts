import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProjectDeletedEvent } from './event/projectDeleted.event';
import { EntityManager } from '@mikro-orm/postgresql';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ProjectRepository } from './repositories/project.repository';
import { Reference } from '@mikro-orm/core';
import { Org } from 'src/org/entities/org.entity';
import { User } from 'src/user/entities/user.entity';
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

  async getProject(projectId: string) {
    try {
      return await this.projectRepository.findOne(projectId);
    } catch (error) {
      throw error;
    }
  }

  async createProject(
    userId: string,
    orgId: string,
    newProject: CreateProjectDto,
  ) {
    try {
      const userRef = Reference.createFromPK(User, userId);
      const orgRef = Reference.createFromPK(Org, orgId);
      const project = new Project(userRef, orgRef, newProject.name);
      await this.em.persistAndFlush(project);
      const projectRef = Reference.createFromPK(Project, project.id);
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

  async updateProject(projectId: string, updates: UpdateProjectDto) {
    try {
      const project = await this.projectRepository.findOne(projectId);
      this.projectRepository.assign(project, updates);
      return project;
    } catch (error) {
      throw error;
    }
  }

  async deleteProject(userId: string, projectId: string) {
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
          project.org.unwrap().id,
          new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
          userId,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async getSelectedProjects(projectIds: string[]) {
    try {
      const qb = this.projectRepository.createQueryBuilder();
      qb.where({ id: { $in: projectIds } });
      return await qb.getResult();
    } catch (error) {
      throw error;
    }
  }

  async getMember(userId: string, projectId: string) {
    return await this.projectRepository.findProjectMember(userId, projectId);
  }
}
