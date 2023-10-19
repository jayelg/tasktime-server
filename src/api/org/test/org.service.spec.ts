import { Test, TestingModule } from '@nestjs/testing';
import { OrgService } from '../org.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityManager } from '@mikro-orm/postgresql';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Org } from '../entities/org.entity';
import { OrgRepository } from '../repositories/org.repository';
import { CreateOrgDto } from '../dto/createOrg.dto';
import { UpdateOrgDto } from '../dto/updateOrg.dto';
import { OrgMember } from '../entities/orgMember.entity';
import { User } from 'src/api/user/entities/user.entity';
import { OrgMemberRole } from '../enum/orgMemberRole.enum';

describe('OrgService', () => {
  let service: OrgService;

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  const mockEntityManager = {
    persistAndFlush: jest.fn(),
    getReference: jest.fn(),
    removeAndFlush: jest.fn(),
  };

  const mockOrgRepository = {
    findOne: jest.fn(),
    assign: jest.fn(),
    findMembersByOrgId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrgService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: getRepositoryToken(Org),
          useValue: mockOrgRepository,
        },
        {
          provide: OrgRepository,
          useValue: mockOrgRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<OrgService>(OrgService);

    // clear all mock response values before each test
    mockEventEmitter.emit.mockClear();
    mockOrgRepository.findOne.mockClear();
    mockEntityManager.getReference.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllOrgs', () => {
    it('should return an array of orgs', async () => {
      const orgId = 'org-id';
      const org = new Org('org-name');
      const expectedResult = [org, { ...org }];
      mockOrgRepository.findOne.mockResolvedValue(expectedResult);
      const result = await service.getOrg(orgId);

      expect(result).toBeInstanceOf(Array);
      expect(result).toEqual(
        expect.arrayContaining(
          expectedResult.map((org) => expect.objectContaining(org)),
        ),
      );
    });
  });

  describe('getOrg', () => {
    it('should return an org', async () => {
      const orgId = 'org-id';
      const org = new Org('org-name');
      mockOrgRepository.findOne.mockResolvedValue(org);
      const result = await service.getOrg(orgId);

      expect(result).toBeInstanceOf(Org);
    });
  });

  describe('createOrg', () => {
    it('should return an org', async () => {
      const userId = 'mock-user-id';
      const newOrgName = 'mock-org-name';
      const data = new CreateOrgDto();
      data.name = newOrgName;
      const expectedResult = new Org(newOrgName);

      const result = await service.createOrg(userId, data);

      expect(result).toBeInstanceOf(Org);
      expect(result.name).toEqual(expectedResult.name);
    });
  });

  describe('updateOrg', () => {
    it('should return an org', async () => {
      const orgId = 'mock-org-id';
      const newOrgName = 'mock-org-name';
      const updates = new UpdateOrgDto();
      updates.name = newOrgName;
      const expectedResult = new Org(newOrgName);
      mockOrgRepository.findOne.mockResolvedValue(expectedResult);

      const result = await service.updateOrg(orgId, updates);

      expect(result).toBeInstanceOf(Org);
    });
  });

  describe('deleteOrg', () => {
    it('should return undefined', async () => {
      const orgId = 'mock-org-id';
      const user = new User('mock@email.com');
      const org = new Org('org-name');
      const orgMember = new OrgMember(user, org, OrgMemberRole.Admin);
      mockOrgRepository.findMembersByOrgId.mockResolvedValue(orgMember);
      mockOrgRepository.findOne.mockResolvedValue(org);

      const result = await service.deleteOrg(orgId);

      expect(result).toBe(undefined);
    });
  });
});
