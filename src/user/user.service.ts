import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './interface/user.interface';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly users: Model<User>,
  ) {}

  private userDocToIUser(userDoc: UserDocument): IUser {
    const user: IUser = {
      ...userDoc.toJSON(),
      // convert all objectId types to strings
      _id: userDoc._id.toString(),
      orgs: userDoc.orgs.map((org) => org._id.toString()),
      personalProjects: userDoc.personalProjects.map((project) =>
        project._id.toString(),
      ),
      unreadNotifications: userDoc.unreadNotifications.map((note) =>
        note._id.toString(),
      ),
      unreadMessages: userDoc.unreadMessages.map((message) =>
        message._id.toString(),
      ),
    };

    return user;
  }

  // used to lookup user during authentication
  async findUserByEmail(email: string): Promise<IUser> {
    const userDoc = await this.users.findOne({ email: email });
    return this.userDocToIUser(userDoc);
  }

  async getUser(userId: string): Promise<IUser> {
    const userDoc = await this.users.findById(userId);
    return this.userDocToIUser(userDoc);
  }

  async createUser(email: string): Promise<IUser> {
    const formattedUser = new this.users({
      email: email,
      createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
    });
    try {
      const userDoc = await formattedUser.save();
      return this.userDocToIUser(userDoc);
    } catch (error) {
      // todo: log error
      throw error;
    }
  }

  async updateUser(userId: string, updates: UpdateUserDto): Promise<IUser> {
    const userDoc = await this.users.findByIdAndUpdate(userId, updates);
    return this.userDocToIUser(userDoc);
  }

  async removeUnreadNotification(userId: string, notificationId: string) {
    const userDoc = await this.users.findById(userId);
    const updatedUnreadNotifications = userDoc.unreadNotifications.filter(
      (note) => note.toString() !== notificationId,
    );
    userDoc.unreadNotifications = updatedUnreadNotifications;
    return this.userDocToIUser(await userDoc.save());
  }

  async deleteUser(userId: string) {
    await this.users.findByIdAndDelete(userId);
  }

  async removeOrg(userId: string, orgId: string) {
    const userDoc = await this.users.findById(userId);
    if (userDoc) {
      const orgIndex = userDoc.orgs.findIndex((org) => org.equals(orgId));
      if (orgIndex !== -1) {
        userDoc.orgs.splice(orgIndex, 1);
        return this.userDocToIUser(await userDoc.save());
      }
    }
    return null;
  }
}
