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

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

class Org {}

export type Subjects = InferSubjects<typeof Org> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  constructor(
    private readonly orgService: OrgService,
    private readonly projectService: ProjectService,
  ) {}

  async defineAbility(userId: string, orgId: string, projectId?: string) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    const org = await this.orgService.getOrg(userId, orgId);
    const orgMember = org.members.find((member) => member._id === userId);

    const project = await this.projectService.getProject(userId, projectId);
    const projectMember = project.members.find(
      (member) => member._id === userId,
    );
    if (orgMember.role === OrgMemberRole.Admin) {
      can(Action.Manage, Org);
    }
    if (projectMember.role === ProjectMemberRole.Admin) {
      can(Action.Manage, Org);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
