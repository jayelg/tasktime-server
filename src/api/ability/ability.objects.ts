import { Org } from 'src/api/org/entities/org.entity';
import { RequiredRule } from './abilities.decorator';
import { Action } from './ability.factory';
import { Project } from 'src/api/project/entities/project.entity';
import { Item } from 'src/api/item/entities/item.entity';

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
export class ManageItemAbility implements RequiredRule {
  action = Action.Manage;
  subject = Item;
}

export class CreateItemAbility implements RequiredRule {
  action = Action.Create;
  subject = Item;
}

export class ViewItemAbility implements RequiredRule {
  action = Action.Read;
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
