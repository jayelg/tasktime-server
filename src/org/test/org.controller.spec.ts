import { Test, TestingModule } from '@nestjs/testing';
import { OrgController } from '../org.controller';
import { OrgService } from '../org.service';

describe('OrgController', () => {
  let controller: OrgController;

  const mockOrgService = {
    getOrgs: jest.fn(),
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
});
