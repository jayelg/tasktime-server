import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';
import { UserRepository } from '../repositories/user.repository';
import { CustomBaseEntity } from '../../shared/entities/customBase.entity';

@Entity({ customRepository: () => UserRepository })
export class User extends CustomBaseEntity {
  [EntityRepositoryType]?: UserRepository;

  @Property()
  email: string;

  @Property()
  firstName = '';

  @Property()
  lastName = '';

  // link to image
  @Property()
  avatar = '';

  @Property()
  lastLoginAt: Date = new Date();

  @Property({ type: 'boolean' })
  disabled = false;

  constructor(email: string) {
    super();
    this.email = email;
  }
}
