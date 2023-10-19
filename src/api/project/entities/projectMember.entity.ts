import { Entity, Enum, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { User } from '../../user/entities/user.entity';
import { Project } from './project.entity';
import { ProjectMemberRole } from '../enum/projectMemberRole.enum';

@Entity()
export class ProjectMember {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @ManyToOne(() => Project)
  project: Project;

  @ManyToOne(() => User)
  member: User;

  @Enum(() => ProjectMemberRole)
  role: ProjectMemberRole;

  constructor(user: User, project: Project, role: ProjectMemberRole) {
    this.project = project;
    this.member = user;
    this.role = role;
  }
}
