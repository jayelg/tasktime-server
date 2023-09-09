import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserInvitedToOrgEvent } from './event/userInvitedToOrg.event';
import { InviteToOrgDto } from './dto/inviteToOrg.dto';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async getUser(userId: string): Promise<User> {
    return await this.userRepository.findOne(userId);
  }

  // used to lookup user during authentication
  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email: email });
  }

  async createUser(email: string): Promise<User> {
    const user = new User(email);
    await this.em.persistAndFlush(user);
    return user;
  }

  async updateUser(userId: string, updates: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne(userId);
    this.userRepository.assign(user, updates);
    await this.em.persistAndFlush(user);
    return user;
  }

  async handleInvitedOrgMember(
    userId: string,
    orgId: string,
    inviteData: InviteToOrgDto,
  ) {
    // get/create invitee user
    let invitedUser = await this.getUserByEmail(inviteData.email);
    if (!invitedUser) {
      invitedUser = await this.createUser(inviteData.email);
    }
    // get inviting user
    const invitedBy = await this.userRepository.findOne(userId);
    // event: recieved by org to add user to org
    this.eventEmitter.emit(
      'user.invitedToOrg',
      new UserInvitedToOrgEvent(
        invitedUser.id,
        invitedUser.email,
        orgId,
        inviteData.role,
        new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
        invitedBy.id,
        invitedBy.firstName,
      ),
    );
  }
}
