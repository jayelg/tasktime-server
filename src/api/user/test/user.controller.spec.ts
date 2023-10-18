import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../user/user.controller';
import { UserService } from '../../user/user.service';
import { UserRequestDto } from 'src/api/auth/dto/userRequest.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { User } from '../entities/user.entity';

const mockUserService = {
  getUser: jest.fn(),
  updateUser: jest.fn(),
  removeUnreadNotification: jest.fn(),
  handleInvitedOrgMember: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should call userService.getUser with the request user id as props', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockRequest = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      mockUserService.getUser.mockResolvedValue(undefined);

      await controller.getProfile(mockRequest);

      expect(mockUserService.getUser).toBeCalledWith(mockUserId);
    });

    it('should return the user profile', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockRequest = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const expectedResult = new User(mockEmail);
      expectedResult.id = mockUserId;

      mockUserService.getUser.mockResolvedValue(expectedResult);

      const result = await controller.getProfile(mockRequest);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateUser', () => {
    it('should call userService.updateUser with the request user id and user data to update as props', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockRequest = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const mockUpdateUserData: UpdateUserDto = {
        firstName: 'John',
        lastName: 'Grant',
      };
      mockUserService.updateUser.mockResolvedValue(undefined);

      await controller.updateUser(mockRequest, mockUpdateUserData);

      expect(mockUserService.updateUser).toBeCalledWith(
        mockUserId,
        mockUpdateUserData,
      );
    });

    it('should return the user', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockRequest = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const mockUpdateUserData = {
        firstName: 'John',
        lastName: 'Grant',
      };
      const expectedResult = new User(mockEmail);
      expectedResult.id = mockUserId;
      expectedResult.firstName = mockUpdateUserData.firstName;
      expectedResult.lastName = mockUpdateUserData.lastName;
      mockUserService.updateUser.mockResolvedValue(expectedResult);

      const result = await controller.updateUser(
        mockRequest,
        mockUpdateUserData,
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('disableUser', () => {
    it('should call userService.disableUser with request user id and { disable: true } props', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockRequest = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      mockUserService.updateUser.mockResolvedValue(undefined);

      await controller.disableUser(mockRequest);

      expect(mockUserService.updateUser).toBeCalledWith(mockUserId, {
        disabled: true,
      });
    });
  });

  describe('enableUser', () => {
    it('should call userService.disableUser with request user id and { disable: false } props', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockRequest = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      mockUserService.updateUser.mockResolvedValue(undefined);

      await controller.enableUser(mockRequest);

      expect(mockUserService.updateUser).toBeCalledWith(mockUserId, {
        disabled: false,
      });
    });
  });
});
