import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';
import { OrgRepository } from '../repositories/org.repository';
import { CustomBaseEntity } from '../../shared/entities/customBase.entity';

@Entity({ customRepository: () => OrgRepository })
export class Org extends CustomBaseEntity {
  [EntityRepositoryType]?: OrgRepository;

  @Property()
  name = 'New Organisation';

  @Property()
  description = '';

  @Property({ type: 'boolean' })
  disabled = false;

  constructor(name: string) {
    super();
    this.name = name;
  }
}
