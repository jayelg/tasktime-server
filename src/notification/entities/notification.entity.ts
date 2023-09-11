import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { CustomBaseEntity } from '../../shared/entities/customBase.entity';
import { User } from '../../user/entities/user.entity';
import { NotificationRepository } from '../repositories/notification.repository';

@Entity({ customRepository: () => NotificationRepository })
export class Notification extends CustomBaseEntity {
  [EntityRepositoryType]?: NotificationRepository;

  @ManyToOne(() => User)
  user: User;

  @Property()
  read = false;

  @Property()
  title: string;

  @Property()
  data: any; // to think further about this.
}
