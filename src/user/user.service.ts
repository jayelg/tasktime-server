import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './interface/user.interface';
import { UpdateUserDto } from './dto/updateUser.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { OrgCreatedEvent } from 'src/org/event/orgCreated.event';
import { OrgRemovedEvent } from 'src/org/event/orgRemoved.event';
import { UserRemovedUnreadNotificationEvent } from './event/UserRemovedUnreadNotification.event';
import { UserCreatedEvent } from './event/userCreated.event';
import { UserInvitedToOrgEvent } from './event/userInvitedToOrg.event';
import { InviteToOrgDto } from './dto/inviteToOrg.dto';
import { NotificationMemberInvitedEvent } from 'src/notification/event/notificationMemberInvited.event';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly users: Model<User>,
    private eventEmitter: EventEmitter2,
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
  async getUserByEmail(email: string): Promise<IUser> {
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
      const user = this.userDocToIUser(userDoc);
      this.eventEmitter.emit(
        'user.created',
        new UserCreatedEvent(user._id, user.email, user.createdAt),
      );
      return user;
    } catch (error) {
      // todo: log error
      throw error;
    }
  }

  async updateUser(userId: string, updates: UpdateUserDto): Promise<IUser> {
    const userDoc = await this.users
      .findByIdAndUpdate(userId, updates, { new: true })
      .exec();
    return this.userDocToIUser(userDoc);
  }

  async removeUnreadNotification(userId: string, notificationId: string) {
    const userDoc = await this.users.findById(userId);
    const updatedUnreadNotifications = userDoc.unreadNotifications.filter(
      (note) => note.toString() !== notificationId,
    );
    userDoc.unreadNotifications = updatedUnreadNotifications;
    const user = this.userDocToIUser(await userDoc.save());
    this.eventEmitter.emit(
      'user.removedUnreadNotification',
      new UserRemovedUnreadNotificationEvent(
        notificationId,
        userId,
        new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
      ),
    );
    return user;
  }

  async handleInvitedOrgMember(
    userId: string,
    orgId: string,
    inviteData: InviteToOrgDto,
  ) {
    // get/create invitee user
    let invitedUser = await this.getUserByEmail(inviteData.email);
    if (!invitedUser) {
      invitedUser = await this.createUser(inviteData.email);
    }
    // get inviting user
    const invitedBy = this.userDocToIUser(await this.users.findById(userId));
    // event: recieved by org to add user to org
    this.eventEmitter.emit(
      'user.invitedToOrg',
      new UserInvitedToOrgEvent(
        invitedUser._id,
        invitedUser.email,
        orgId,
        inviteData.role,
        new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
        invitedBy._id,
        invitedBy.firstName,
      ),
    );
  }

  // Event Listeners

  @OnEvent('org.created', { async: true })
  async addOrg(payload: OrgCreatedEvent) {
    await this.users.findByIdAndUpdate(
      payload.createdBy,
      { $addToSet: { orgs: payload.orgId } },
      { new: true },
    );
  }

  @OnEvent('org.removed', { async: true })
  async removeOrg(payload: OrgRemovedEvent) {
    const userDoc = await this.users.findById(payload.removedBy);
    if (userDoc) {
      const orgIndex = userDoc.orgs.findIndex((org) =>
        org.equals(payload.orgId),
      );
      if (orgIndex !== -1) {
        userDoc.orgs.splice(orgIndex, 1);
        return this.userDocToIUser(await userDoc.save());
      }
    }
    return null;
  }

  @OnEvent('notification.memberInvited', { async: true })
  async addUnreadNotification(payload: NotificationMemberInvitedEvent) {
    await this.updateUser(payload.notification.user, {
      unreadNotifications: [payload.notification._id],
    });
  }
}
