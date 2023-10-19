import { Test, TestingModule } from '@nestjs/testing';
import { AbilityFactory, Action, AppAbility } from '../ability.factory';
import { OrgService } from 'src/api/org/org.service';
import { ProjectService } from 'src/api/project/project.service';
import { ItemService } from 'src/api/item/item.service';
import { Project } from 'src/api/project/entities/project.entity';
import { Item } from 'src/api/item/entities/item.entity';
import { Org } from 'src/api/org/entities/org.entity';
import { OrgMemberRole } from 'src/api/org/enum/orgMemberRole.enum';
import { ProjectMemberRole } from 'src/api/project/enum/projectMemberRole.enum';
import { User } from 'src/api/user/entities/user.entity';
import { ItemMemberRole } from 'src/api/item/enum/itemMemberRole.enum';

describe('AbilityFactory', () => {
  let service: AbilityFactory;

  const mockOrgService = {
    getOrg: jest.fn(),
    getMember: jest.fn(),
  };

  const mockProjectService = {
    getProject: jest.fn(),
    getMember: jest.fn(),
  };

  const mockItemService = {
    getItem: jest.fn(),
    getMember: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbilityFactory, OrgService, ProjectService, ItemService],
    })
      .overrideProvider(OrgService)
      .useValue(mockOrgService)
      .overrideProvider(ProjectService)
      .useValue(mockProjectService)
      .overrideProvider(ItemService)
      .useValue(mockItemService)
      .compile();

    service = module.get<AbilityFactory>(AbilityFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('defineAbility', () => {
    describe('Org Abilities', () => {
      it('should give org admin correct permissions for Org', async () => {
        const userId = 'user-id';
        const userRole = OrgMemberRole.Admin;
        const org = new Org('mock-name');
        const user = new User('mock@email.com');
        mockOrgService.getMember = jest.fn().mockResolvedValue({
          user: user,
          org: org,
          role: userRole,
        });

        // dummy orgId is required to handle org abilities
        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 'org-id',
        });

        expect(ability.can(Action.Manage, Org)).toBeTruthy();
        expect(ability.can(Action.Create, Project)).toBeTruthy();
      });

      it('should give org project manager correct permissions for Org', async () => {
        const userId = 'user-id';
        const userRole = OrgMemberRole.ProjectManager;
        const org = new Org('mock-name');
        const user = new User('mock@email.com');
        mockOrgService.getMember = jest.fn().mockResolvedValue({
          user: user,
          org: org,
          role: userRole,
        });

        // dummy orgId is required to handle org abilities
        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 'org-id',
        });

        expect(ability.can(Action.Create, Org)).toBeTruthy(); // any user can create a new org
        // expect(ability.can(Action.Create, Project)).toBeTruthy(); only for orgPM or orgAdmin
        expect(ability.can(Action.Manage, Org)).toBeFalsy();
        expect(ability.can(Action.Read, Org)).toBeTruthy();
      });

      it('should give org member correct permissions for Org', async () => {
        const userId = 'user-id';
        const userRole = OrgMemberRole.Member;
        const org = new Org('mock-name');
        const user = new User('mock@email.com');
        mockOrgService.getMember = jest.fn().mockResolvedValue({
          user: user,
          org: org,
          role: userRole,
        });

        // dummy orgId is required to handle org abilities
        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 'org-id',
        });

        expect(ability.can(Action.Create, Org)).toBeTruthy(); // any user can create a new org
        expect(ability.can(Action.Create, Project)).toBeFalsy();
        expect(ability.can(Action.Manage, Org)).toBeFalsy();
        expect(ability.can(Action.Read, Org)).toBeTruthy();
      });

      it('should not give any abilities if user is not member of org', async () => {
        const userId = 'user-id';
        mockOrgService.getMember = jest.fn().mockResolvedValue({});

        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 'org-id',
        });

        expect(ability.can(Action.Create, Org)).toBeTruthy(); // always allowed for users
        expect(ability.can(Action.Manage, Org)).toBeFalsy(); // any user can create a new org
        expect(ability.can(Action.Update, Org)).toBeFalsy();
        expect(ability.can(Action.Read, Org)).toBeFalsy();
        expect(ability.can(Action.Delete, Org)).toBeFalsy();
      });
    });

    describe('Project Abilities', () => {
      it('should give project admin correct permissions for Project', async () => {
        const userId = 'user-id';
        const orgId = 'org-id';
        const projectId = 'project-id';
        const orgRole = OrgMemberRole.Admin;
        const projectRole = ProjectMemberRole.Admin;

        const org = new Org('mock-name');
        org.id = orgId;
        const user = new User('mock@email.com');
        const project = new Project(user, org, 'project-name');
        project.id = projectId;
        mockOrgService.getMember = jest.fn().mockResolvedValue({
          user: user,
          org: org,
          role: orgRole,
        });
        mockProjectService.getProject = jest.fn().mockResolvedValue(project);
        mockProjectService.getMember = jest.fn().mockResolvedValue({
          user: user,
          project: project,
          role: projectRole,
        });

        // dummy orgId is required to handle org abilities
        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 'org-id',
          projectId: projectId,
        });

        expect(ability.can(Action.Manage, Project)).toBeTruthy();
      });

      it('should give project member correct permissions for Project', async () => {
        const userId = 'user-id';
        const orgId = 'org-id';
        const projectId = 'project-id';
        const orgRole = OrgMemberRole.Admin;
        const projectRole = ProjectMemberRole.Member;
        const org = new Org('mock-name');
        org.id = orgId;
        const user = new User('mock@email.com');
        const project = new Project(user, org, 'project-name');
        project.id = projectId;
        mockOrgService.getMember = jest.fn().mockResolvedValue({
          user: user,
          org: org,
          role: orgRole,
        });
        mockProjectService.getProject = jest.fn().mockResolvedValue(project);
        mockProjectService.getMember = jest.fn().mockResolvedValue({
          user: user,
          project: project,
          role: projectRole,
        });

        // dummy orgId is required to handle org abilities
        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 'org-id',
          projectId: projectId,
        });

        expect(ability.can(Action.Create, Item)).toBeTruthy();
        expect(ability.can(Action.Manage, Project)).toBeFalsy();
        expect(ability.can(Action.Read, Project)).toBeTruthy();
      });

      it('should give project viewer correct permissions for Project', async () => {
        const userId = 'user-id';
        const orgId = 'org-id';
        const projectId = 'project-id';
        const orgRole = OrgMemberRole.Member;
        const projectRole = ProjectMemberRole.Viewer;
        const org = new Org('mock-name');
        org.id = orgId;
        const user = new User('mock@email.com');
        const project = new Project(user, org, 'project-name');
        project.id = projectId;
        mockOrgService.getMember = jest.fn().mockResolvedValue({
          user: user,
          org: org,
          role: orgRole,
        });
        mockProjectService.getProject = jest.fn().mockResolvedValue(project);
        mockProjectService.getMember = jest.fn().mockResolvedValue({
          user: user,
          project: project,
          role: projectRole,
        });
        import { AuthGuard } from '@nestjs/passport';
        etMember = jest.fn().mockResolvedValue({
          user: user,
          org: org,
          role: orgRole,
        });
        mockProjectService.getProject = jest.fn().mockResolvedValue(project);
        mockProjectService.getMember = jest.fn().mockResolvedValue({
          user: user,
          project: project,
          role: projectRole,
        });

        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 'org-id',
          projectId: projectId,
        });

        expect(ability.can(Action.Read, Project)).toBeTruthy(); // project is not hidden
        expect(ability.can(Action.Create, Project)).toBeFalsy(); // org Members can create projects ignoring projectId
        expect(ability.can(Action.Manage, Project)).toBeFalsy();
        expect(ability.can(Action.Update, Project)).toBeFalsy();
        expect(ability.can(Action.Delete, Project)).toBeFalsy();
        expect(ability.can(Action.Create, Item)).toBeFalsy();
      });

      it('should not give abilities if user is member of project but not a member of org', async () => {
        const userId = 'user-id';
        const orgId = 'org-id';
        const projectId = 'project-id';
        const user = new User('mock@email.com');
        const org = new Org('mock-name');
        org.id = orgId;
        const project = new Project(user, org, 'project-name');
        project.id = projectId;
        // getMember returns empty as user is not member or org
        mockOrgService.getMember = jest.fn().mockResolvedValue({});
        mockProjectService.getProject = jest.fn().mockResolvedValue(project);
        mockProjectService.getMember = jest.fn().mockResolvedValue({
          user: user,
          project: project,
          role: ProjectMemberRole.Viewer,
        });

        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: orgId,
          projectId: projectId,
        });

        expect(ability.can(Action.Read, Project)).toBeFalsy();
      });

      it('should not give abilities if project is not of org', async () => {
        // input parameters
        const userId = 'user-id';
        const orgId = 'org-id';
        const projectId = 'project-id';
        // roles
        const orgRole = OrgMemberRole.Member;
        const projectRole = ProjectMemberRole.Viewer;
        // creating entities
        const user = new User('mock@email.com');
        const orgUserIsMember = new Org('mock-org-1');
        const orgUserIsNotMember = new Org('mock-org-2');
        const project = new Project(user, orgUserIsNotMember, 'project-name');
        // setting entitiy properties
        orgUserIsMember.id = orgId;
        orgUserIsNotMember.id = 'Different-org-Id';
        project.id = projectId;
        project.org = orgUserIsNotMember; // project is not in orgUserIsMember
        // mocking services
        // user is member of org
        mockOrgService.getMember = jest.fn().mockResolvedValue({
          user: user,
          org: orgUserIsMember,
          role: orgRole,
        });
        // project is in database
        mockProjectService.getProject = jest.fn().mockResolvedValue(project);
        // user is member of project
        mockProjectService.getMember = jest.fn().mockResolvedValue({
          user: user,
          project: project,
          role: projectRole,
        });

        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 'org-id',
          projectId: projectId,
        });

        expect(ability.can(Action.Read, Project)).toBeFalsy();
      });
    });

    describe('Item Abilities', () => {
      it('should give item owner correct permissions for Item', async () => {
        // input parameters
        const userId = 'user-id';
        const orgId = 'org-id';
        const projectId = 'project-id';
        const itemId = 'item-id';
        // roles
        const orgRole = OrgMemberRole.Member;
        const projectRole = ProjectMemberRole.Member;
        const itemRole = ItemMemberRole.Owner;
        // creating entities
        const user = new User('mock@email.com');
        const org = new Org('org-name');
        const project = new Project(user, org, 'project-name');
        const item = new Item(user, project, 'item-name');
        //assigning properties
        org.id = orgId;
        project.id = projectId;
        project.org = org;
        item.id = itemId;
        item.project = project;
        // create mock responses
        mockOrgService.getMember = jest.fn().mockResolvedValue({
          user: user,
          org: org,
          role: orgRole,
        });
        mockProjectService.getProject = jest.fn().mockResolvedValue(project);
        mockProjectService.getMember = jest.fn().mockResolvedValue({
          user: user,
          project: project,
          role: projectRole,
        });
        mockItemService.getItem = jest.fn().mockResolvedValue(item);
        mockItemService.getMember = jest.fn().mockResolvedValue({
          user: user,
          item: item,
          role: itemRole,
        });

        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: orgId,
          projectId: projectId,
          itemId: itemId,
        });

        expect(ability.can(Action.Manage, Item)).toBeTruthy();
      });
    });
  });
});
