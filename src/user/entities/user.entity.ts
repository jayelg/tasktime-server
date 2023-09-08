import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';
import { UserRepository } from '../repositories/user.repository';
import { CustomBaseEntity } from 'src/shared/entities/customBase.entity';

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
  lastLoginAt = '';

  @Property()
  disabled = false;

  constructor(email: string) {
    super();
    this.email = email;
  }
}
