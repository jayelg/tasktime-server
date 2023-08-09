export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  orgs: string[]; // stored for better db query. the single point of truth is org.members
  personalProjects: string[];
  createdAt: string;
  lastLoginAt: string;
  unreadNotifications: string[];
  unreadMessages: string[];
  disabled: boolean;
}
