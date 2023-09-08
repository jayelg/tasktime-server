import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';
import { CustomBaseEntity } from 'src/shared/entities/customBase.entity';
import { EventRepository } from '../repositories/event.repository';

@Entity({ customRepository: () => EventRepository })
export class Event extends CustomBaseEntity {
  [EntityRepositoryType]?: EventRepository;

  @Property()
  data: any; // to think further about this.
}
