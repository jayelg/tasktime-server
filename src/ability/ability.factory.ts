import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { OrgMemberRole } from 'src/org/enum/orgMemberRole.enum';
import { ProjectMemberRole } from 'src/project/enum/projectMemberRole.enum';
import { OrgService } from 'src/org/org.service';
import { ProjectService } from 'src/project/project.service';
import { Project } from 'src/project/project.schema';
import { Org } from 'src/org/org.schema';
import { Item } from 'src/item/item.schema';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects =
  | InferSubjects<typeof Org | typeof Project | typeof Item>
  | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  constructor(
    private readonly orgService: OrgService,
    private readonly projectService: ProjectService,
  ) {}

  async defineAbility(userId?: string, orgId?: string, projectId?: string) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    can(Action.Create, Org);
    // get roles from org and project
    if (orgId) {
      try {
        const org = await this.orgService.getOrg(userId, orgId);
        const orgMember = org.members.find((member) => member._id === userId);
        if (orgMember.role === OrgMemberRole.Admin) {
          can(Action.Read, Project); // can see all project including hidden
          can(Action.Manage, Org);
        } else if (
          orgMember.role === OrgMemberRole.ProjectManager ||
          orgMember.role === OrgMemberRole.Admin
        ) {
          can(Action.Create, Project);
        } else if (
          orgMember.role === OrgMemberRole.Member ||
          orgMember.role === OrgMemberRole.ProjectManager ||
          orgMember.role === OrgMemberRole.Admin
        ) {
          can(Action.Read, Org);
        }
      } catch (error) {}
    }

    if (projectId) {
      try {
        const project = await this.projectService.getProject(userId, projectId);
        const projectMember = project.members.find(
          (member) => member._id === userId,
        );
        if (projectMember.role === ProjectMemberRole.Admin) {
          can(Action.Manage, Project);
        } else if (
          projectMember.role === ProjectMemberRole.Member ||
          projectMember.role === ProjectMemberRole.Admin
        ) {
          can(Action.Create, Item);
        } else if (project.isHidden === false) {
          can(Action.Read, Project);
        }
      } catch (error) {}
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
