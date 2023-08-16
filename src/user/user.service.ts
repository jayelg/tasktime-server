import { Injectable } from '@nestjs/common';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dto/updateUser.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { OrgCreatedEvent } from 'src/org/event/orgCreated.event';
import { OrgRemovedEvent } from 'src/org/event/orgRemoved.event';
import { UserRemovedUnreadNotificationEvent } from './event/UserRemovedUnreadNotification.event';
import { UserCreatedEvent } from './event/userCreated.event';
import { UserInvitedToOrgEvent } from './event/userInvitedToOrg.event';
import { InviteToOrgDto } from './dto/inviteToOrg.dto';
import { NotificationMemberInvitedEvent } from 'src/notification/event/notificationMemberInvited.event';
import { MagicLoginEvent } from 'src/auth/event/magicLogin.event';
import { UserLoginEvent } from './event/userLogin.event';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly users: Model<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  async getUser(userId: string): Promise<UserDto> {
    return new UserDto(await this.users.findById(userId));
  }

  // used to lookup user during authentication
  async getUserByEmail(email: string): Promise<UserDto> {
    return new UserDto(await this.users.findOne({ email: email }));
  }

  async createUser(email: string): Promise<UserDto> {
    const formattedUser = new this.users({
      email: email,
      createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
    });
    try {
      const user = new UserDto(await formattedUser.save());
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

  async updateUser(userId: string, updates: UpdateUserDto): Promise<UserDto> {
    return new UserDto(
      await this.users.findByIdAndUpdate(userId, updates, { new: true }).exec(),
    );
  }

  async removeUnreadNotification(
    userId: string,
    notificationId: string,
  ): Promise<UserDto> {
    const userDoc = await this.users.findById(userId);
    const updatedUnreadNotifications = userDoc.unreadNotifications.filter(
      (note) => note.toString() !== notificationId,
    );
    userDoc.unreadNotifications = updatedUnreadNotifications;
    const user = new UserDto(await userDoc.save());
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
    const invitedBy = new UserDto(await this.users.findById(userId));
    // event: recieved by org to add user to org
    this.eventEmitter.emit(
      'user.invitedToOrg',
      new UserInvitedToOrgEvent(
        invitedUser._id,
        invitedUser.email,
        orgId,
        inviteData.role,
        new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
        invitedBy._id.toString(),
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
  async removeOrg(payload: OrgRemovedEvent): Promise<UserDto | null> {
    const userDoc = await this.users.findById(payload.removedBy);
    if (userDoc) {
      const orgIndex = userDoc.orgs.findIndex((org) =>
        org.equals(payload.orgId),
      );
      if (orgIndex !== -1) {
        userDoc.orgs.splice(orgIndex, 1);
        return new UserDto(await userDoc.save());
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

  @OnEvent('magicLogin.login', { async: true })
  async getUserForMagicLogin(payload: MagicLoginEvent) {
    // check if user exists etc.
    let user = await this.getUserByEmail(payload.email);
    let newUser = false;
    if (!user) {
      newUser = true;
      user = await this.createUser(payload.email);
    }
    this.eventEmitter.emit(
      'user.login',
      new UserLoginEvent(user.firstName, user.email, payload.url, newUser),
    );
  }
}
