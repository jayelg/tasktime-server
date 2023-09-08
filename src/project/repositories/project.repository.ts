import { EntityRepository } from '@mikro-orm/postgresql';
import { Project } from '../entities/project.entity';
import { ProjectMember } from '../entities/projectMember.entity';

export class ProjectRepository extends EntityRepository<Project> {
  async findMembersByProjectId(projectId: number): Promise<ProjectMember[]> {
    return this.em.find(ProjectMember, { project: projectId });
  }
}
