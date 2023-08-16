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
import { UserInvitedToOrgEvent } from '../event/userInvitedToOrg.event';
import { OrgRemovedEvent } from 'src/org/event/orgRemoved.event';
import { OrgCreatedEvent } from 'src/org/event/orgCreated.event';
import { NotificationMemberInvitedEvent } from 'src/notification/event/notificationMemberInvited.event';
import { INotification } from 'src/notification/interface/notification.interface';
import { MagicLoginEvent } from 'src/auth/event/magicLogin.event';
import { UserLoginEvent } from '../event/userLogin.event';

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

    // clear events recorded before each test
    mockEventEmitter.emit.mockClear();
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

  describe('handleInvitedOrgMember', () => {
    it('should emit an event with details of the invited org member', async () => {
      // Data in request
      const userId = '64cb9221153711233158ff78';
      const orgId = '64cb9221153711233158ff76';
      const inviteData = {
        email: 'testinvite@email.com',
        role: 'orgMember',
      };
      // Create a initial user in the db
      const invitedUserId = '64cb9221153711233158ff72';
      const invitedUser = new UserDto(
        await userModel.create({
          _id: new Types.ObjectId(invitedUserId),
          email: inviteData.email,
        }),
      );
      // Create the current user in the db
      const userFirstName = 'John';
      const currentUser = new UserDto(
        await userModel.create({
          _id: new Types.ObjectId(userId),
          firstName: userFirstName,
        }),
      );
      const mockEventEmit = jest.spyOn(mockEventEmitter, 'emit');
      // mock the getUserByEmail method in the userService
      const mockCreateUserMethod = jest.spyOn(service, 'createUser');
      mockCreateUserMethod.mockResolvedValue(invitedUser);

      await service.handleInvitedOrgMember(userId, orgId, inviteData);

      const emittedEventArgs = mockEventEmit.mock.calls[0];

      // Assert the properties of the emitted event
      expect(emittedEventArgs[0]).toEqual('user.invitedToOrg');
      const userInvitedEvent = emittedEventArgs[1] as UserInvitedToOrgEvent;
      expect(userInvitedEvent).toBeInstanceOf(UserInvitedToOrgEvent);
      expect(userInvitedEvent.inviteeUserId).toEqual(invitedUser._id);
      expect(userInvitedEvent.inviteeEmail).toEqual(inviteData.email);
      expect(userInvitedEvent.orgId).toEqual(orgId);
      expect(userInvitedEvent.role).toEqual(inviteData.role);
      expect(userInvitedEvent.invitedByUserId).toEqual(currentUser._id);
      expect(userInvitedEvent.invitedByName).toEqual(currentUser.firstName);
    });
  });

  describe('addOrg', () => {
    it('should add the org in event payload to the user', async () => {
      const orgId = '64cb9221153711233158ff72';
      const orgName = 'Test Org Name';
      const createdAt = 'Test date';
      const createdBy = '64cb9221153711233158ff78';
      const payload = new OrgCreatedEvent(orgId, orgName, createdAt, createdBy);
      await userModel.create({
        _id: new Types.ObjectId(createdBy),
      });

      await service.addOrg(payload);

      const updatedUser = new UserDto(await userModel.findById(createdBy));

      expect(updatedUser.orgs).toContain(orgId);
    });
  });

  describe('removeOrg', () => {
    it('should remove the org in event payload from the user', async () => {
      const orgId = '64cb9221153711233158ff72';
      const orgName = 'Test Org Name';
      const createdAt = 'Test date';
      const createdBy = '64cb9221153711233158ff78';
      const payload = new OrgRemovedEvent(orgId, orgName, createdAt, createdBy);
      await userModel.create({
        _id: new Types.ObjectId(createdBy),
        orgs: [new Types.ObjectId(orgId)],
      });

      await service.removeOrg(payload);

      const updatedUser = new UserDto(await userModel.findById(createdBy));

      expect(updatedUser.orgs).not.toContain(orgId);
    });
  });

  describe('addUnreadNotification', () => {
    it('should add the notification in the event payload to the user', async () => {
      const userId = '64cb9221153711233158ff78';
      const userEmail = 'test@email.com';
      const notificaiton: INotification = {
        _id: '64cb9221153711233158ff72',
        user: userId,
        createdAt: 'Test date',
        unread: true,
        title: 'Test Title',
        body: 'Test Body',
        button: 'Click Here',
        type: 'test',
        reference: 'test',
      };
      const payload = new NotificationMemberInvitedEvent(
        notificaiton,
        userEmail,
      );
      await userModel.create({
        _id: new Types.ObjectId(userId),
      });

      await service.addUnreadNotification(payload);

      const updatedUser = new UserDto(await userModel.findById(userId));

      expect(updatedUser.unreadNotifications).toContain(notificaiton._id);
    });
  });

  describe('getUserForMagicLogin', () => {
    it('should add user info to payload and emit event', async () => {
      const userId = '64cb9221153711233158ff78';
      const newUserEmail = 'newuser@email.com';
      const url = 'magicLinkURL';
      const payload = new MagicLoginEvent(newUserEmail, url);
      const user = await userModel.create({
        _id: new Types.ObjectId(userId),
        email: newUserEmail,
        firstName: 'John',
      });
      const mockEventEmit = jest.spyOn(mockEventEmitter, 'emit');

      await service.getUserForMagicLogin(payload);

      const emittedEventArgs = mockEventEmit.mock.calls[0];

      // Assert the properties of the emitted event
      expect(emittedEventArgs[0]).toEqual('user.login');
      const userInvitedEvent = emittedEventArgs[1] as UserLoginEvent;
      expect(userInvitedEvent).toBeInstanceOf(UserLoginEvent);
      expect(userInvitedEvent.userFirstName).toEqual(user.firstName);
      expect(userInvitedEvent.email).toEqual(user.email);
      expect(userInvitedEvent.url).toEqual(url);
      expect(userInvitedEvent.newUser).toEqual(false);
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
