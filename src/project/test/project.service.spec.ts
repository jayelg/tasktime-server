import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from '../project.service';
import { Project, ProjectSchema } from '../project.schema';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from 'src/test/utils/mongoTest.module';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model } from 'mongoose';

describe('ProjectService', () => {
  let service: ProjectService;
  let projectModel: Model<Project>;

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
      ],
      providers: [
        ProjectService,
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    projectModel = module.get<Model<Project>>(getModelToken('Project'));

    // clear in memory db before each test
    await projectModel.deleteMany({});

    // clear events recorded before each test
    mockEventEmitter.emit.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
