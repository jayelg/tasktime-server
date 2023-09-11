import { Test, TestingModule } from '@nestjs/testing';
import { OrgController } from '../org.controller';
import { OrgService } from '../org.service';
import { UserRequestDto } from 'src/auth/dto/userRequest.dto';
import { Org } from '../entities/org.entity';
import { CreateOrgDto } from '../dto/createOrg.dto';
import { UpdateOrgDto } from '../dto/updateOrg.dto';

describe('OrgController', () => {
  let controller: OrgController;

  const mockOrgService = {
    getAllOrgs: jest.fn(),
    getOrg: jest.fn(),
    createOrg: jest.fn(),
    updateOrg: jest.fn(),
    deleteOrg: jest.fn(),
    removeMember: jest.fn(),
    removeProject: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgController],
      providers: [OrgService],
    })
      .overrideProvider(OrgService)
      .useValue(mockOrgService)
      .compile();

    controller = module.get<OrgController>(OrgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllOrgs', () => {
    it('should call orgService.getAllOrgs method with userId', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      mockOrgService.getAllOrgs.mockResolvedValue(undefined);
      await controller.getAllOrgs(mockReq);
      expect(mockOrgService.getAllOrgs).toBeCalledWith(mockReq.user.id);
    });

    it('should return an array of orgs', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const org = new Org('org-name');
      const expectedResult = [org, { ...org }];
      mockOrgService.getAllOrgs.mockResolvedValue(expectedResult);
      const result = await controller.getAllOrgs(mockReq);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getOrg', () => {
    it('should call orgService.getOrg method with orgId', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const orgId = 'org-id';
      mockOrgService.getOrg.mockResolvedValue(undefined);
      await controller.getOrg(mockReq, orgId);
      expect(mockOrgService.getOrg).toBeCalledWith(orgId);
    });

    it('should return an org', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const orgId = 'org-id';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const expectedResult = new Org('org-name');
      mockOrgService.getOrg.mockResolvedValue(expectedResult);

      const result = await controller.getOrg(mockReq, orgId);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('createOrg', () => {
    it('should call orgService.createOrg method with userId and CreateOrgDto', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const newOrg = new CreateOrgDto();
      newOrg.name = 'org-name';
      mockOrgService.createOrg.mockResolvedValue(undefined);
      await controller.createOrg(mockReq, newOrg);
      expect(mockOrgService.createOrg).toBeCalledWith(mockReq.user.id, newOrg);
    });

    it('should return an org', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const newOrg = new CreateOrgDto();
      newOrg.name = 'org-name';
      const expectedResult = new Org('org-name');
      mockOrgService.createOrg.mockResolvedValue(expectedResult);

      const result = await controller.createOrg(mockReq, newOrg);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateOrg', () => {
    it('should call orgService.updateOrg method with userId and UpdateOrgDto', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const orgId = 'org-id';
      const orgUpdeates = new UpdateOrgDto();
      orgUpdeates.name = 'org-name';
      mockOrgService.updateOrg.mockResolvedValue(undefined);
      await controller.updateOrg(mockReq, orgId, orgUpdeates);
      expect(mockOrgService.updateOrg).toBeCalledWith(orgId, orgUpdeates);
    });

    it('should return an org', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const orgId = 'org-id';
      const orgUpdates = new UpdateOrgDto();
      orgUpdates.name = 'org-name';
      const expectedResult = new Org('org-name');
      mockOrgService.updateOrg.mockResolvedValue(expectedResult);

      const result = await controller.updateOrg(mockReq, orgId, orgUpdates);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteOrg', () => {
    it('should call orgService.deleteOrg method with orgId', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const orgId = 'org-id';
      mockOrgService.deleteOrg.mockResolvedValue(undefined);
      await controller.deleteOrg(mockReq, orgId);
      expect(mockOrgService.deleteOrg).toBeCalledWith(orgId);
    });

    it('should return undefined', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const orgId = 'org-id';
      const orgUpdates = new UpdateOrgDto();
      orgUpdates.name = 'org-name';
      mockOrgService.deleteOrg.mockResolvedValue(undefined);

      const result = await controller.deleteOrg(mockReq, orgId);

      expect(result).toBe(undefined);
    });
  });
});
