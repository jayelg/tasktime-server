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

@Injectable()
export class ProjectService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Project)
    private readonly projectRepository: ProjectRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async getProject(projectId: number) {
    try {
      return await this.projectRepository.findOne(projectId);
    } catch (error) {
      throw error;
    }
  }

  async createProject(
    userId: number,
    orgId: number,
    newProject: CreateProjectDto,
  ) {
    try {
      const userRef = Reference.createFromPK(User, userId);
      const orgRef = Reference.createFromPK(Org, orgId);
      const project = new Project(userRef, orgRef, newProject.name);
      await this.em.persistAndFlush(project);
      return project;
    } catch (error) {
      throw error;
    }
  }

  async updateProject(projectId: number, updates: UpdateProjectDto) {
    try {
      const project = await this.projectRepository.findOne(projectId);
      this.projectRepository.assign(project, updates);
      return project;
    } catch (error) {
      throw error;
    }
  }

  async deleteProject(userId: number, projectId: number) {
    try {
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

  async getSelectedProjects(projectIds: number[]) {
    try {
      const qb = this.projectRepository.createQueryBuilder();
      qb.where({ id: { $in: projectIds } });
      return await qb.getResult();
    } catch (error) {
      throw error;
    }
  }
}
