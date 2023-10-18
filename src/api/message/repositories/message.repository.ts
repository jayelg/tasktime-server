import { EntityRepository } from '@mikro-orm/postgresql';
import { Message } from '../entities/message.entity';

export class MessageRepository extends EntityRepository<Message> {}
