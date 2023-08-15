import { UserDto } from 'src/user/dto/user.dto';

export function createMockUserDto(overrides: Partial<UserDto> = {}): UserDto {
  const defaultUserData = {
    _id: 'default-user-id',
    email: 'default-email',
    firstName: 'default-firstName',
    lastName: 'default-lastName',
    avatar: 'default-avatar',
    orgs: ['default-org-id-1', 'default-org-id-2'],
    personalProjects: ['default-project-id-1', 'default-project-id-2'],
    createdAt: 'default-createdAt-date',
    lastLoginAt: 'default-lastLoginAt-date',
    unreadNotifications: [
      'default-notification-id-1',
      'default-notification-id-2',
    ],
    unreadMessages: ['default-message-id-1', 'default-message-id-2'],
    disabled: false,
  };

  const mergedUserData = { ...defaultUserData, ...overrides };

  return new UserDto(mergedUserData);
}
