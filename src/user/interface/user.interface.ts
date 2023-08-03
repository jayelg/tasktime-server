export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  orgs: string[];
  personalProjects: string[];
  createdAt: string;
  lastLoginAt: string;
  unreadNotifications: string[];
  unreadMessages: string[];
}
