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
import { Project } from 'src/project/entities/project.entity';
import { Org } from 'src/org/entities/org.entity';
import { Item } from 'src/item/entities/item.entity';
import { ItemService } from 'src/item/item.service';
import { defineAbilityDto } from './dto/defineAbility.dto';
import { ItemMemberRole } from 'src/item/enum/itemMemberRole.enum';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Review = 'review',
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

  // Orgs contain projects and projects contain items
  // if user is not a member of org, they do not have abilities for projects
  // if user is not a member of org or project, they do not have abilities for items

  async defineAbility({ userId, orgId, projectId, itemId }: defineAbilityDto) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    can(Action.Create, Org);

    let org;
    let project;
    let item;

    try {
      if (orgId) {
        const orgMember = await this.orgService.getMember(userId, orgId);
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
            if (projectId) {
              project = await this.projectService.getProject(projectId);
              // check project is in org
              if (project && project.org.id === orgId) {
                if (!project.isHidden) {
                  can(Action.Read, Project);
                }
                const projectMember = await this.projectService.getMember(
                  userId,
                  projectId,
                );
                if (projectMember) {
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
                    projectMember.role === ProjectMemberRole.Viewer ||
                    projectMember.role === ProjectMemberRole.Member ||
                    projectMember.role === ProjectMemberRole.Admin
                  ) {
                    can(Action.Read, Project);
                    if (itemId) {
                      item = await this.itemService.getItem(itemId);
                      // check item is in project
                      if (item && item.project.id === projectId) {
                        const itemMember = await this.itemService.getMember(
                          userId,
                          itemId,
                        );
                        if (itemMember) {
                          if (itemMember.role === ItemMemberRole.Owner) {
                            can(Action.Manage, Item);
                            can(Action.Update, Item);
                          }
                          if (itemMember.role === ItemMemberRole.Member) {
                            can(Action.Update, Item);
                          }
                          if (itemMember.role === ItemMemberRole.Reviewer) {
                            can(Action.Review, Item);
                          }
                          if (itemMember.role === ItemMemberRole.Viewer) {
                            can(Action.Read, Item);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
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
