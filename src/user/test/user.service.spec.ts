import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserService } from '../../user/user.service';
import { User, UserSchema } from 'src/user/user.schema';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/utils/mongoTest.module';
import { Model, Types } from 'mongoose';
import { UserDto } from 'src/user/dto/user.dto';

const mockEventEmitter = {
  emit: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      ],
      providers: [
        UserService,
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken('User'));

    // clear in memory db before each test
    await userModel.deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a userDto', async () => {
      const userId = '64cb9221153711233158ff78';
      const mockUserData = new userModel({
        _id: userId,
        email: 'user@example.com',
        createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
      });
      const mockUser = await mockUserData.save();
      const expectedResult = new UserDto(mockUser);

      const result = await service.getUser(userId);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a userDto', async () => {
      const userId = '64cb9221153711233158ff78';
      const userEmail = 'user@example.com';
      const mockUserData = new userModel({
        _id: userId,
        email: userEmail,
        createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
      });
      const mockUser = await mockUserData.save();
      const expectedResult = new UserDto(mockUser);

      const result = await service.getUserByEmail(userEmail);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('createUser', () => {
    it('should save a new user to db', async () => {
      const userEmail = 'user@example.com';
      const mockUserSave = jest.spyOn(userModel.prototype, 'save');

      await service.createUser(userEmail);

      expect(mockUserSave).toBeCalled();
    });

    it('should return a userDto', async () => {
      const userEmail = 'user@example.com';
      const mockUserDoc = new userModel({
        email: userEmail,
      });
      const expectedResult = new UserDto(mockUserDoc);

      const result = await service.createUser(userEmail);

      expect(result).toBeInstanceOf(UserDto);
      expect(result.email).toEqual(expectedResult.email);
    });
  });

  describe('updateUser', () => {
    it('should update the user and return a userDto', async () => {
      // Data in request
      const userId = '64cb9221153711233158ff78';
      const updates = {
        firstName: 'John',
      };
      // Create a initial user in the db
      const initialUser = await userModel.create({
        _id: new Types.ObjectId(userId),
        firstName: 'InitialName',
      });
      const expectedResult = new UserDto(initialUser);
      expectedResult.firstName = updates.firstName;

      const result = await service.updateUser(userId, updates);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('removeUnreadNotification', () => {
    it('should removed the requested notification', async () => {
      // Data in request
      const userId = '64cb9221153711233158ff78';
      const notification = '64cb9221153711233158ff73';
      // Create a initial user in the db
      const secondNotification = '64cb9221153711233158ff71';
      const initialUser = await userModel.create({
        _id: new Types.ObjectId(userId),
        unreadNotifications: [
          new Types.ObjectId(notification),
          new Types.ObjectId(secondNotification),
        ],
      });
      const expectedResult = new UserDto(initialUser);
      expectedResult.unreadNotifications = [secondNotification];

      const result = await service.removeUnreadNotification(
        userId,
        notification,
      );

      expect(result).toEqual(expectedResult);
    });
    it('should emit an event', async () => {
      // Data in request
      const userId = '64cb9221153711233158ff78';
      const notification = '64cb9221153711233158ff73';
      // Create a initial user in the db
      await userModel.create({
        _id: new Types.ObjectId(userId),
        unreadNotifications: [new Types.ObjectId(notification)],
      });
      const mockEventEmit = jest.spyOn(mockEventEmitter, 'emit');

      await service.removeUnreadNotification(userId, notification);

      expect(mockEventEmit).toBeCalled();
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
