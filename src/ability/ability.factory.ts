import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OrgMemberRole } from 'src/org/enum/orgMemberRole.enum';
import { ProjectMemberRole } from 'src/project/enum/projectMemberRole.enum';
import { OrgService } from 'src/org/org.service';
import { ProjectService } from 'src/project/project.service';
import { Project } from 'src/project/project.schema';
import { Org } from 'src/org/org.schema';
import { Item } from 'src/item/item.schema';
import { ItemService } from 'src/item/item.service';
import { defineAbilityDto } from './dto/defineAbility.dto';

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
    private readonly itemService: ItemService,
  ) {}

  async defineAbility({ userId, orgId, projectId, itemId }: defineAbilityDto) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    can(Action.Create, Org);

    let org;
    let project;
    let item;

    // get roles from org and project
    try {
      if (orgId) {
        org = await this.orgService.getOrg(orgId);
        const orgMember = org.members.find((member) => member._id === userId);
        if (orgMember) {
          if (orgMember.role === OrgMemberRole.Admin) {
            can(Action.Read, Project); // can see all project including hidden
            can(Action.Manage, Org);
          }
          if (
            orgMember.role === OrgMemberRole.ProjectManager ||
            orgMember.role === OrgMemberRole.Admin
          ) {
            can(Action.Create, Project);
          }
          if (
            orgMember.role === OrgMemberRole.Member ||
            orgMember.role === OrgMemberRole.ProjectManager ||
            orgMember.role === OrgMemberRole.Admin
          ) {
            can(Action.Read, Org);
          }
        }
      }

      if (projectId) {
        project = await this.projectService.getProject(projectId);
        if (
          org.projects.includes(project._id) ||
          org.members.some((member) => member._id === userId)
        ) {
          const projectMember = project.members.find(
            (member) => member._id === userId,
          );
          if (projectMember.role === ProjectMemberRole.Admin) {
            can(Action.Manage, Project);
          }
          if (
            projectMember.role === ProjectMemberRole.Member ||
            projectMember.role === ProjectMemberRole.Admin
          ) {
            can(Action.Create, Item);
          }
          if (
            project.isHidden === false ||
            projectMember.role === ProjectMemberRole.Viewer
          ) {
            can(Action.Read, Project);
          }
        }
      }

      if (itemId) {
        item = await this.itemService.getItem(itemId);
        // is the user allocated to the project?
        const itemAllocatedTo = item.allocatedTo.find(
          (user) => user === userId,
        );
        // check item is in project
        if (item.project === projectId) {
          if (itemAllocatedTo === userId) {
            can(Action.Manage, Item);
          } else {
            can(Action.Read, Item);
          }
        } else if (
          item.project === ProjectMemberRole.Member ||
          itemAllocatedTo === ProjectMemberRole.Admin
        ) {
          can(Action.Create, Item);
        }
      }
    } catch (error) {
      throw error;
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
