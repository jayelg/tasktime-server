import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserService } from '../user.service';
import { AuthValidateUserEvent } from 'src/api/auth/event/authValidate.event';
import { UserValidatedEvent } from '../event/userValidated.event';

@Injectable()
export default class AuthValidateUserListener {
  constructor(
    private userService: UserService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('auth.validateUser', { async: true })
  async handleAuthValidatorEvent(event: AuthValidateUserEvent) {
    let user = await this.userService.getUserByEmail(event.email);
    if (!user) {
      user = await this.userService.createUser(event.email);
    }
    this.eventEmitter.emit('user.validated', new UserValidatedEvent(user));
  }
}
