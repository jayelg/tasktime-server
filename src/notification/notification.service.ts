import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Notification } from './notification.schema';
import mongoose, { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { MemberInvitedEvent } from 'src/org/event/memberInvited.event';
import { NotificationMemberInvitedEvent } from './event/notificationMemberInvited.event';
import { NotificationDeletedEvent } from './event/notificationDeleted.event';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private readonly notifications: mongoose.Model<Notification>,
    private eventEmitter: EventEmitter2,
  ) {}

  notFoundError = 'Notification not found';

  // todo: return pagnated result instead of all
  async getAllNotifications(userId: string): Promise<NotificationDto[]> {
    try {
      const notifications = await this.notifications
        .find({ user: userId })
        .exec();
      if (notifications.length === 0) {
        throw new NotFoundException(
          `Get All Notifications Service: No notifications for ${userId}`,
        );
      } else {
        return notifications.map((note) => new NotificationDto(note));
      }
    } catch (error) {
      // todo: log error
      throw error;
    }
  }

  // todo move auth to CASL
  async getNotification(
    userId: string,
    notificationId: string,
  ): Promise<NotificationDto> {
    try {
      const notificationDoc = await this.notifications.findById(notificationId);
      const notification = new NotificationDto(notificationDoc);
      if (notification.user === userId) {
        return notification;
      }
    } catch (error) {
      throw new NotFoundException(this.notFoundError);
    }
  }

  async createNotification(
    notificationData: CreateNotificationDto,
  ): Promise<NotificationDto> {
    const newNotification = new this.notifications({
      ...notificationData,
      user: new Types.ObjectId(notificationData.user),
      createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
      unread: true,
    });
    return new NotificationDto(await newNotification.save());
  }

  async updateUnread(
    notificationId: string,
    newUnread: boolean,
  ): Promise<NotificationDto> {
    try {
      return new NotificationDto(
        await this.notifications.findByIdAndUpdate(notificationId, {
          unread: newUnread,
        }),
      );
    } catch (error) {
      throw new NotFoundException(this.notFoundError);
    }
  }

  async deleteNotification(
    userId: string,
    notificationId: string,
  ): Promise<void> {
    try {
      const notification = new NotificationDto(
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
