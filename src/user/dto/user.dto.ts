import mongoose from 'mongoose';
import { UserDocument } from '../user.schema';

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

  constructor(data: UserDocument | UserDto) {
    if (data instanceof mongoose.Document) {
      const user = data.toJSON();
      this._id = data._id.toString();
      this.email = user.email;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.avatar = user.avatar;
      this.orgs = user.orgs.map((org) => org._id.toString());
      this.personalProjects = user.personalProjects.map((project) =>
        project._id.toString(),
      );
      this.unreadNotifications = user.unreadNotifications.map((note) =>
        note._id.toString(),
      );
      this.unreadMessages = user.unreadMessages.map((message) =>
        message._id.toString(),
      );
      this.disabled = user.disabled;
    } else if (
      'email' in data &&
      'firstName' in data &&
      'lastName' in data &&
      'avatar' in data &&
      'orgs' in data &&
      'personalProjects' in data &&
      'createdAt' in data &&
      'lastLoginAt' in data &&
      'unreadNotifications' in data &&
      'unreadMessages' in data &&
      'disabled' in data
    ) {
      this._id = data._id;
      this.email = data.email;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.avatar = data.avatar;
      this.orgs = data.orgs;
      this.personalProjects = data.personalProjects;
      this.createdAt = data.createdAt;
      this.lastLoginAt = data.lastLoginAt;
      this.unreadNotifications = data.unreadNotifications;
      this.unreadMessages = data.unreadMessages;
      this.disabled = data.disabled;
    } else {
      throw new Error('Invalid arguments for UserDto constructor.');
    }
  }
}
