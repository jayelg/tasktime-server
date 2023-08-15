import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from '../project.service';
import { getModelToken } from '@nestjs/mongoose';
import { OrgService } from 'src/org/org.service';
import { UserService } from 'src/user/user.service';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        OrgService,
        UserService,
        {
          provide: getModelToken('Project'),
          useValue: {},
        },
        {
          provide: getModelToken('Org'),
          useValue: {},
        },
        {
          provide: getModelToken('User'),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
