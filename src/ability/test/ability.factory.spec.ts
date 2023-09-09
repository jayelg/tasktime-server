import { Test, TestingModule } from '@nestjs/testing';
import { AbilityFactory, Action, AppAbility } from '../ability.factory';
import { OrgService } from 'src/org/org.service';
import { ProjectService } from 'src/project/project.service';
import { ItemService } from 'src/item/item.service';
import { Project } from 'src/project/entities/project.entity';
import { Item } from 'src/item/entities/item.entity';
import { Org } from 'src/org/entities/org.entity';
import { OrgMemberRole } from 'src/org/enum/orgMemberRole.enum';
import { ProjectMemberRole } from 'src/project/enum/projectMemberRole.enum';

describe('AbilityFactory', () => {
  let service: AbilityFactory;

  const mockOrgService = {
    getOrg: jest.fn(),
  };

  const mockProjectService = {
    getProject: jest.fn(),
  };

  const mockItemService = {
    getItem: jest.fn(),
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
        const userId = 123;
        const userRole = OrgMemberRole.Admin;
        mockOrgService.getOrg = jest.fn().mockResolvedValue({
          members: [{ _id: userId, role: userRole }],
        });

        // dummy orgId is required to handle org abilities
        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 456,
        });

        expect(ability.can(Action.Manage, Org)).toBeTruthy();
        expect(ability.can(Action.Create, Project)).toBeTruthy();
      });

      it('should give org project manager correct permissions for Org', async () => {
        const userId = 123;
        const userRole = OrgMemberRole.ProjectManager;
        mockOrgService.getOrg = jest.fn().mockResolvedValue({
          members: [{ _id: userId, role: userRole }],
        });

        // dummy orgId is required to handle org abilities
        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 456,
        });

        expect(ability.can(Action.Create, Org)).toBeTruthy(); // any user can create a new org
        // expect(ability.can(Action.Create, Project)).toBeTruthy(); only for orgPM or orgAdmin
        expect(ability.can(Action.Manage, Org)).toBeFalsy();
        expect(ability.can(Action.Read, Org)).toBeTruthy();
      });

      it('should give org member correct permissions for Org', async () => {
        const userId = 123;
        const userRole = OrgMemberRole.Member;
        mockOrgService.getOrg = jest.fn().mockResolvedValue({
          members: [{ _id: userId, role: userRole }],
        });

        // dummy orgId is required to handle org abilities
        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 456,
        });

        expect(ability.can(Action.Create, Org)).toBeTruthy(); // any user can create a new org
        expect(ability.can(Action.Create, Project)).toBeFalsy();
        expect(ability.can(Action.Manage, Org)).toBeFalsy();
        expect(ability.can(Action.Read, Org)).toBeTruthy();
      });

      it('should not give any abilities if user is not member of org', async () => {
        const userId = 123;
        const userRole = OrgMemberRole.Member;
        mockOrgService.getOrg = jest.fn().mockResolvedValue({
          members: [{ _id: 'differentUser', role: userRole }],
        });

        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 456,
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
        const userId = 123;
        const projectId = 789;
        const orgRole = OrgMemberRole.Admin;
        const projectRole = ProjectMemberRole.Admin;

        mockOrgService.getOrg = jest.fn().mockResolvedValue({
          projects: [projectId],
          members: [{ _id: userId, role: orgRole }],
        });
        mockProjectService.getProject = jest.fn().mockResolvedValue({
          _id: projectId,
          members: [{ _id: userId, role: projectRole }],
          isHidden: false,
        });

        // dummy orgId is required to handle org abilities
        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 456,
          projectId: 789,
        });

        expect(ability.can(Action.Manage, Project)).toBeTruthy();
      });

      it('should give project member correct permissions for Project', async () => {
        const userId = 123;
        const projectId = 789;
        const orgRole = OrgMemberRole.Admin;
        const projectRole = ProjectMemberRole.Member;
        mockOrgService.getOrg = jest.fn().mockResolvedValue({
          projects: [projectId],
          members: [{ _id: userId, role: orgRole }],
        });
        mockProjectService.getProject = jest.fn().mockResolvedValue({
          _id: projectId,
          members: [{ _id: userId, role: projectRole }],
          isHidden: false,
        });

        // dummy orgId is required to handle org abilities
        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 456,
          projectId: 789,
        });

        expect(ability.can(Action.Create, Item)).toBeTruthy();
        expect(ability.can(Action.Manage, Project)).toBeFalsy();
        expect(ability.can(Action.Read, Project)).toBeTruthy();
      });

      it('should give project viewer correct permissions for Project', async () => {
        const userId = 123;
        const projectId = 789;
        const orgRole = OrgMemberRole.Member;
        const projectRole = ProjectMemberRole.Viewer;
        mockOrgService.getOrg = jest.fn().mockResolvedValue({
          projects: [projectId],
          members: [{ _id: userId, role: orgRole }],
        });
        mockProjectService.getProject = jest.fn().mockResolvedValue({
          _id: projectId,
          members: [{ _id: userId, role: projectRole }],
          isHidden: false,
        });

        // dummy orgId is required to handle org abilities
        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 456,
          projectId: 789,
        });

        expect(ability.can(Action.Create, Item)).toBeFalsy();
        expect(ability.can(Action.Manage, Project)).toBeFalsy();
        expect(ability.can(Action.Read, Project)).toBeTruthy();
      });

      it('should give orgMember who is not a member of project correct abilities', async () => {
        const userId = 123;
        const projectId = 789;
        const orgRole = OrgMemberRole.Member;
        const projectRole = ProjectMemberRole.Viewer;
        // user is member of org and project is in org
        mockOrgService.getOrg = jest.fn().mockResolvedValue({
          projects: [projectId],
          members: [{ _id: userId, role: orgRole }],
        });
        // project has a different user as a member
        mockProjectService.getProject = jest.fn().mockResolvedValue({
          _id: projectId,
          members: [{ _id: 'differentUser', role: projectRole }],
          isHidden: false,
        });

        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 456,
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
        const userId = 123;
        const projectId = 789;
        const projectRole = ProjectMemberRole.Viewer;
        mockOrgService.getOrg = jest.fn().mockResolvedValue({
          projects: [projectId],
          members: [{ _id: 'differentUser', role: 'differentUserRole' }],
        });
        mockProjectService.getProject = jest.fn().mockResolvedValue({
          _id: projectId,
          members: [{ _id: userId, role: projectRole }],
          isHidden: false,
        });

        // dummy orgId is required to handle org abilities
        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 456,
          projectId: projectId,
        });

        expect(ability.can(Action.Read, Project)).toBeFalsy();
      });

      it('should not give abilities if project is not of org', async () => {
        const userId = 123;
        const orgRole = OrgMemberRole.Member;
        const projectId = 789;
        const projectRole = ProjectMemberRole.Viewer;
        mockOrgService.getOrg = jest.fn().mockResolvedValue({
          projects: ['differentProject'],
          members: [{ _id: userId, role: orgRole }],
        });
        mockProjectService.getProject = jest.fn().mockResolvedValue({
          _id: projectId,
          members: [{ _id: userId, role: projectRole }],
          isHidden: false,
        });

        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 456,
          projectId: projectId,
        });

        expect(ability.can(Action.Read, Project)).toBeFalsy();
      });
    });

    describe('Item Abilities', () => {
      it('should give item assigned members correct permissions for Item', async () => {
        const userId = 123;
        const projectId = 789;
        const orgRole = OrgMemberRole.Member;
        const projectRole = ProjectMemberRole.Member;

        mockOrgService.getOrg = jest.fn().mockResolvedValue({
          projects: [projectId],
          members: [{ _id: userId, role: orgRole }],
        });
        mockProjectService.getProject = jest.fn().mockResolvedValue({
          _id: projectId,
          members: [{ _id: userId, role: projectRole }],
          isHidden: false,
        });
        mockItemService.getItem = jest.fn().mockResolvedValue({
          allocatedTo: [userId],
          project: projectId,
        });

        // dummy orgId is required to handle org abilities
        const ability: AppAbility = await service.defineAbility({
          userId: userId,
          orgId: 456,
          projectId: projectId,
          itemId: 111,
        });

        expect(ability.can(Action.Manage, Item)).toBeTruthy();
      });
    });
  });
});
