import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
  Reference,
} from '@mikro-orm/core';
import { CustomBaseEntity } from 'src/shared/entities/customBase.entity';
import { User } from '../../user/entities/user.entity';
import { MessageRepository } from '../repositories/message.repository';

@Entity({ customRepository: () => MessageRepository })
export class Message extends CustomBaseEntity {
  [EntityRepositoryType]?: MessageRepository;

  @ManyToOne(() => User)
  sender: Reference<User>;

  @ManyToOne(() => User)
  recipient: Reference<User>;

  @Property()
  read = false;

  @Property()
  title: string;

  @Property()
  body: string;
}
