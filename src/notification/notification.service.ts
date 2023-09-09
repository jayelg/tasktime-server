import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { MemberInvitedEvent } from 'src/org/event/memberInvited.event';
import { NotificationMemberInvitedEvent } from './event/notificationMemberInvited.event';
import { NotificationDeletedEvent } from './event/notificationDeleted.event';
import { NotificationDto } from './dto/notification.dto';
import { EntityManager, Reference } from '@mikro-orm/core';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotificationRepository } from './repositories/notification.repository';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Notification)
    private readonly notificationRepository: NotificationRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  notFoundError = 'Notification not found';

  // todo: return pagnated result instead of all
  async getAllNotifications(userId: string): Promise<Notification[]> {
    try {
      const notifications = await this.notificationRepository.find({
        user: userId,
      });
      if (notifications.length === 0) {
        throw new NotFoundException(
          `Get All Notifications Service: No notifications for ${userId}`,
        );
      } else {
        return notifications;
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
  ): Promise<Notification> {
    try {
      const notification = await this.notificationRepository.findOne(
        notificationId,
      );
      if (notification.user.unwrap().id === userId) {
        return notification;
      }
    } catch (error) {
      throw new NotFoundException(this.notFoundError);
    }
  }

  async createNotification(
    notificationData: CreateNotificationDto,
  ): Promise<Notification> {
    try {
      const notification = new Notification();
      notification.user = Reference.createFromPK(User, notificationData.user);
      notification.title = notificationData.title;
      notification.data = notificationData.data;
      this.em.persistAndFlush(notification);
      return notification;
    } catch (error) {
      throw error;
    }
  }

  async updateRead(
    notificationId: string,
    newRead: boolean,
  ): Promise<Notification> {
    try {
      const notification = await this.notificationRepository.findOne(
        notificationId,
      );
      notification.read = newRead;
      this.em.persistAndFlush(notification);
      return notification;
    } catch (error) {
      throw error;
    }
  }

  async deleteNotification(
    userId: string,
    notificationId: string,
  ): Promise<void> {
    try {
      const notification = this.notificationRepository.findOne(notificationId);
      if (!notification) {
        throw new NotFoundException(this.notFoundError);
      }
      await this.em.removeAndFlush(notification);
    } catch (error) {
      throw error;
    }
  }

  // move to orgService/
  // @OnEvent('org.memberInvited', { async: true })
  // async orgInvite(payload: MemberInvitedEvent) {
  //   const notificationTitle = `${
  //     payload.invitedByName !== ''
  //       ? `${payload.invitedByName} has invited you`
  //       : `You have been invited`
  //   } to join ${payload.orgName}`;
  //   const newNotification: CreateNotificationDto = {
  //     user: payload.invitedByUserId,
  //     title: notificationTitle,
  //     body: 'Click here to join',
  //     button: 'Accept',
  //     type: 'orgInvite',
  //     reference: payload.invitedByUserId.toString(),
  //   };
  //   const notification = await this.createNotification(newNotification);
  //   this.eventEmitter.emit(
  //     'notification.memberInvited',
  //     new NotificationMemberInvitedEvent(notification, payload.inviteeEmail),
  //   );
  // }
}
