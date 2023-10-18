import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from '../notification.controller';
import { NotificationService } from '../notification.service';

describe('NotificationController', () => {
  let controller: NotificationController;

  const mockNotificationService = {
    getAllNotifications: jest.fn(),
    getNotification: jest.fn(),
    createNotification: jest.fn(),
    updateUnread: jest.fn(),
    deleteNotification: jest.fn(),
    removeMember: jest.fn(),
    removeProject: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [NotificationService],
    })
      .overrideProvider(NotificationService)
      .useValue(mockNotificationService)
      .compile();

    controller = module.get<NotificationController>(NotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
