import { Test, TestingModule } from '@nestjs/testing';
import { AbilityFactory } from '../ability.factory';
import { OrgService } from 'src/org/org.service';
import { ProjectService } from 'src/project/project.service';
import { ItemService } from 'src/item/item.service';

describe('AbilityFactory', () => {
  let service: AbilityFactory;

  const mockOrgService = {
    getItem: jest.fn(),
  };

  const mockProjectService = {
    getItem: jest.fn(),
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
});
