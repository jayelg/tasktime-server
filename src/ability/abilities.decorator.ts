import { SetMetadata } from '@nestjs/common';
import { Action, Subjects } from './ability.factory';
import { Org } from 'src/org/entities/org.entity';
import { Project } from 'src/project/entities/project.entity';
import { Item } from 'src/item/entities/item.entity';

export interface RequiredRule {
  action: Action;
  subject: Subjects;
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);

// todo more

// Org
export class ManageOrgAbility implements RequiredRule {
  action = Action.Manage;
  subject = Org;
}

export class CreateOrgAbility implements RequiredRule {
  action = Action.Create;
  subject = Org;
}

export class ViewOrgAbility implements RequiredRule {
  action = Action.Read;
  subject = Org;
}

export class UpdateOrgAbility implements RequiredRule {
  action = Action.Update;
  subject = Org;
}

export class DeleteOrgAbility implements RequiredRule {
  action = Action.Delete;
  subject = Org;
}

// Project
export class ManageProjectAbility implements RequiredRule {
  action = Action.Manage;
  subject = Project;
}

export class CreateProjectAbility implements RequiredRule {
  action = Action.Create;
  subject = Project;
}

export class ViewProjectAbility implements RequiredRule {
  action = Action.Read;
  subject = Project;
}

export class UpdateProjectAbility implements RequiredRule {
  action = Action.Update;
  subject = Project;
}

export class DeleteProjectAbility implements RequiredRule {
  action = Action.Delete;
  subject = Project;
}

//Item
export class CreateItemAbility implements RequiredRule {
  action = Action.Create;
  subject = Item;
}

export class UpdateItemAbility implements RequiredRule {
  action = Action.Update;
  subject = Item;
}

export class DeleteItemAbility implements RequiredRule {
  action = Action.Delete;
  subject = Item;
}
