import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from '../notification.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from 'src/test/utils/mongoTest.module';
import { Notification, NotificationSchema } from '../notification.schema';
import { Model } from 'mongoose';

describe('NotificationService', () => {
  let service: NotificationService;
  let notificationModel: Model<Notification>;

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Notification', schema: NotificationSchema },
        ]),
      ],
      providers: [
        NotificationService,
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    notificationModel = module.get<Model<Notification>>(
      getModelToken('Notification'),
    );

    // clear in memory db before each test
    await notificationModel.deleteMany({});

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
