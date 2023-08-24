import mongoose from 'mongoose';
import { User } from '../user.schema';

// shape of user.schema.ts
// represents object returned from db
export class UserDto {
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
  disabled: boolean;

  constructor(data: User | UserDto) {
    this._id = data._id.toString();
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.avatar = data.avatar;
    this.orgs = data.orgs.map((org) => org.toString());
    this.personalProjects = data.personalProjects.map((project) =>
      project.toString(),
    );
    this.unreadNotifications = data.unreadNotifications.map((note) =>
      note.toString(),
    );
    this.unreadMessages = data.unreadMessages.map((message) =>
      message.toString(),
    );
    this.disabled = data.disabled;
  }
}
