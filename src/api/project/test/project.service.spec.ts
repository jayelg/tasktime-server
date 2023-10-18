import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from '../project.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityManager } from '@mikro-orm/postgresql';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Project } from '../entities/project.entity';
import { ProjectRepository } from '../repositories/project.repository';
import { CreateProjectDto } from '../dto/createProject.dto';
import { Org } from 'src/api/org/entities/org.entity';
import { User } from 'src/api/user/entities/user.entity';

describe('ProjectService', () => {
  let service: ProjectService;

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  const mockEntityManager = {
    persistAndFlush: jest.fn(),
    getReference: jest.fn(),
  };

  const mockProjectRepository = {
    findOne: jest.fn(),
    assign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectRepository,
        },
        {
          provide: ProjectRepository,
          useValue: mockProjectRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);

    // clear events recorded before each test
    mockEventEmitter.emit.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProject', () => {
    it('should return a project', async () => {
      const userId = 'mock-user-id';
      const newProject = new CreateProjectDto();
      newProject.name = 'mock-project-name';
      const user = new User('mock@email.com');
      const org = new Org('mock org name');
      const expectedResult = new Project(user, org, newProject.name);

      const result = await service.createProject(userId, newProject);

      expect(result).toBeInstanceOf(Project);
      expect(result.name).toEqual(expectedResult.name);
    });
  });
});
