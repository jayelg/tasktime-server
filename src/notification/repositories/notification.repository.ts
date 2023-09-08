import { EntityRepository } from '@mikro-orm/postgresql';
import { Notification } from '../entities/notification.entity';

export class NotificationRepository extends EntityRepository<Notification> {}
