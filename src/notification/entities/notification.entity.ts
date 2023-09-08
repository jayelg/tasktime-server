import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
  Reference,
} from '@mikro-orm/core';
import { CustomBaseEntity } from 'src/shared/entities/customBase.entity';
import { User } from 'src/user/entities/user.entity';
import { NotificationRepository } from '../repositories/notification.repository';

@Entity({ customRepository: () => NotificationRepository })
export class Notification extends CustomBaseEntity {
  [EntityRepositoryType]?: NotificationRepository;

  @ManyToOne(() => User)
  user: Reference<User>;

  @Property()
  read = false;

  @Property()
  title: string;

  @Property()
  data: any; // to think further about this.
}
