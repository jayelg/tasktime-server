import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserService } from '../../user/user.service';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { getRepositoryToken } from '@mikro-orm/nestjs';

const mockEventEmitter = {
  emit: jest.fn(),
};

const mockUserRepository = {
  findOne: jest.fn(),
  assign: jest.fn(),
};

const mockEntityManager = {
  persistAndFlush: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UserService,
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    // clear events recorded before each test
    mockEventEmitter.emit.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      const userId = 'mock-userId';
      const expectedResult = new User('user@example.com');
      expectedResult.id = userId;
      mockUserRepository.findOne.mockResolvedValue(expectedResult);

      const result = await service.getUser(userId);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user', async () => {
      const userId = 'mock-userId';
      const userEmail = 'user@example.com';
      const expectedResult = new User('user@example.com');
      expectedResult.id = userId;
      mockUserRepository.findOne.mockResolvedValue(expectedResult);

      const result = await service.getUserByEmail(userEmail);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('createUser', () => {
    it('should save a new user to db', async () => {
      const userEmail = 'user@example.com';
      const mockUserSave = jest.spyOn(mockEntityManager, 'persistAndFlush');

      await service.createUser(userEmail);

      expect(mockUserSave).toBeCalled();
    });

    it('should return a user', async () => {
      const userEmail = 'user@example.com';

      const expectedResult = new User(userEmail);

      const result = await service.createUser(userEmail);

      expect(result).toBeInstanceOf(User);
      expect(result.email).toEqual(expectedResult.email);
    });
  });

  describe('updateUser', () => {
    it('should update the user and return a user', async () => {
      // Data in request
      const userId = 'mock-userId';
      const updates = {
        firstName: 'John',
      };
      // Create a initial user in the db
      const initialUser = new User('user@example.com');
      initialUser.id = userId;
      initialUser.firstName = 'InitialName';
      const expectedResult = { ...initialUser };
      expectedResult.firstName = updates.firstName;
      mockUserRepository.findOne.mockResolvedValue(initialUser);
      const assignMock = jest.spyOn(mockUserRepository, 'assign');
      assignMock.mockImplementation((user, updates) => {
        Object.assign(user, updates);
      });
      mockEntityManager.persistAndFlush.mockResolvedValue(initialUser);

      const result = await service.updateUser(userId, updates);

      expect(result).toEqual(expectedResult);
    });
  });
});
