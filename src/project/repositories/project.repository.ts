import { EntityRepository } from '@mikro-orm/postgresql';
import { Project } from '../entities/project.entity';
import { ProjectMember } from '../entities/projectMember.entity';

export class ProjectRepository extends EntityRepository<Project> {
  async findMembersByProjectId(projectId: string): Promise<ProjectMember[]> {
    return this.em.find(ProjectMember, { project: projectId });
  }

  async findProjectMember(
    userId: string,
    projectId: string,
  ): Promise<ProjectMember> {
    return await this.em.findOne(ProjectMember, {
      member: userId,
      project: projectId,
    });
  }

  async findProjectsByMemberId(userId: string): Promise<ProjectMember[]> {
    return await this.em.find(ProjectMember, {
      member: userId,
    });
  }
}
