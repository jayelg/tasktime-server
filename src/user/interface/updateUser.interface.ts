export interface IUpdateUser {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  orgs?: string[];
  personalProjects?: string[];
  unreadNotifications?: string[];
  unreadMessages?: string[];
}
