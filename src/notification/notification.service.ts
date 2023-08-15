import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Notification, NotificationDocument } from './notification.schema';
import mongoose, { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { INotification } from './interface/notification.interface';
import { IUser } from 'src/user/interface/user.interface';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { MemberInvitedEvent } from 'src/org/event/memberInvited.event';
import { NotificationMemberInvitedEvent } from './event/notificationMemberInvited.event';
import { NotificationDeletedEvent } from './event/notificationDeleted.event';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private readonly notifications: mongoose.Model<Notification>,
    private eventEmitter: EventEmitter2,
  ) {}

  notFoundError = 'Notification not found';

  private NotificationDocToINotification(
    notificationDoc: NotificationDocument,
  ) {
    const notification: INotification = {
      ...notificationDoc.toJSON(),
      _id: notificationDoc._id.toString(),
      user: notificationDoc.user.toString(),
    };
    return notification;
  }

  // todo: return pagnated result instead of all
  async getAllNotifications(userId: string): Promise<INotification[]> {
    try {
      const notifications = await this.notifications
        .find({ user: userId })
        .exec();
      if (notifications.length === 0) {
        throw new NotFoundException(
          `Get All Notifications Service: No notifications for ${userId}`,
        );
      } else {
        return notifications.map((note) =>
          this.NotificationDocToINotification(note),
        );
      }
    } catch (error) {
      // todo: log error
      throw error;
    }
  }

  async getNotification(
    userId: string,
    notificationId: string,
  ): Promise<INotification> {
    try {
      const notificationDoc = await this.notifications.findById(notificationId);
      const notification = this.NotificationDocToINotification(notificationDoc);
      if (notification.user === userId) {
        return notification;
      }
    } catch (error) {
      throw new NotFoundException(this.notFoundError);
    }
  }

  async createNotification(
    notificationData: CreateNotificationDto,
  ): Promise<INotification> {
    const newNotification = new this.notifications({
      ...notificationData,
      user: new Types.ObjectId(notificationData.user),
      createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
      unread: true,
    });
    return this.NotificationDocToINotification(await newNotification.save());
  }

  async updateUnread(
    notificationId: string,
    newUnread: boolean,
  ): Promise<INotification> {
    try {
      const notificationDoc = await this.notifications.findByIdAndUpdate(
        notificationId,
        {
          unread: newUnread,
        },
      );
      return this.NotificationDocToINotification(notificationDoc);
    } catch (error) {
      throw new NotFoundException(this.notFoundError);
    }
  }

  async deleteNotification(
    userId: string,
    notificationId: string,
  ): Promise<void> {
    try {
      const notification = this.NotificationDocToINotification(
        await this.notifications.findById(notificationId),
      );
      if (!(notification.user === userId)) {
        throw new UnauthorizedException();
      }
      await this.notifications.findByIdAndDelete(notificationId);
      this.eventEmitter.emit(
        'notification.deleted',
        new NotificationDeletedEvent(notification),
      );
    } catch (error) {
      throw new NotFoundException(this.notFoundError);
    }
  }

  @OnEvent('org.memberInvited', { async: true })
  async orgInvite(payload: MemberInvitedEvent) {
    const notificationTitle = `${
      payload.invitedByName !== ''
        ? `${payload.invitedByName} has invited you`
        : `You have been invited`
    } to join ${payload.orgName}`;
    const newNotification: CreateNotificationDto = {
      user: payload.invitedByUserId,
      title: notificationTitle,
      body: 'Click here to join',
      button: 'Accept',
      type: 'orgInvite',
      reference: payload.invitedByUserId,
    };
    const notification = await this.createNotification(newNotification);
    this.eventEmitter.emit(
      'notification.memberInvited',
      new NotificationMemberInvitedEvent(notification, payload.inviteeEmail),
    );
  }
}
