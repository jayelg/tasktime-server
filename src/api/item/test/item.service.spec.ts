import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ItemService } from '../item.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Item } from '../entities/item.entity';
import { ItemRepository } from '../repositories/item.repository';
import { Project } from 'src/api/project/entities/project.entity';
import { User } from 'src/api/user/entities/user.entity';
import { Org } from 'src/api/org/entities/org.entity';
import { NewItemDto } from '../dto/newItem.dto';

describe('ItemService', () => {
  let service: ItemService;

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  const mockEntityManager = {
    persistAndFlush: jest.fn(),
    getReference: jest.fn(),
  };

  const mockItemRepository = {
    findOne: jest.fn(),
    assign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: getRepositoryToken(Item),
          useValue: mockItemRepository,
        },
        {
          provide: ItemRepository,
          useValue: mockItemRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);

    // clear events recorded before each test
    mockEventEmitter.emit.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createItem', () => {
    it('should return a item', async () => {
      const userId = 'mock-user-id';
      const projectId = 'mock-projectId-id';
      const newProject = new NewItemDto();
      newProject.name = 'mock-project-name';
      const user = new User('mock@email.com');
      const org = new Org('mock org name');
      const project = new Project(user, org, 'mock org name');
      const expectedResult = new Item(user, project, newProject.name);

      const result = await service.createItem(userId, projectId, newProject);

      expect(result).toBeInstanceOf(Item);
      expect(result.name).toEqual(expectedResult.name);
    });
  });
});
