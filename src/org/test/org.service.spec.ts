import { Test, TestingModule } from '@nestjs/testing';
import { OrgService } from '../org.service';
import { OrgDto } from '../dto/org.dto';
import mongoose, { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Org, OrgSchema } from '../org.schema';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from 'src/test/utils/mongoTest.module';

describe('OrgService', () => {
  let service: OrgService;
  let orgModel: Model<Org>;

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: 'Org', schema: OrgSchema }]),
      ],
      providers: [
        OrgService,
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<OrgService>(OrgService);
    orgModel = module.get<Model<Org>>(getModelToken('Org'));

    // clear in memory db before each test
    await orgModel.deleteMany({});

    // clear events recorded before each test
    mockEventEmitter.emit.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('createOrg', () => {
  //   it('should create organization', () => {
  //     // Creator is org admin by default
  //     const orgAdminUserId = '64a63893bc1b3da3558df2bf';
  //     const newOrg: CreateOrgDto = {
  //       name: 'Test Org 1',
  //     };

  //     // Act
  //     const org = service.createOrg(orgAdminUserId, newOrg);

  //     // Assert
  //     expect(org).toBe(newOrg.name); // org.name
  //     expect(org).toContain(
  //       // org.members
  //       new mongoose.Types.ObjectId(orgAdminUserId),
  //     );
  //   });
  // });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
