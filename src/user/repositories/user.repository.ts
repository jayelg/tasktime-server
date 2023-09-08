import { EntityRepository } from '@mikro-orm/postgresql'; // Import EntityManager from your driver package or `@mikro-orm/knex`
import { User } from '../entities/user.entity';

export class UserRepository extends EntityRepository<User> {}
