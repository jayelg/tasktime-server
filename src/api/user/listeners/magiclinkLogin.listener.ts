import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserService } from '../user.service';
import { MagicLoginEvent } from 'src/api/auth/event/magicLogin.event';
import { UserLoginEvent } from '../event/userLogin.event';

@Injectable()
export class MagicLinkLoginListener {
  constructor(
    private userService: UserService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('magicLogin.login')
  async handleMagiclinkLoginEvent(event: MagicLoginEvent) {
    // get existing or create new user
    let user = await this.userService.getUserByEmail(event.email);
    let newUser = false;
    if (!user) {
      newUser = true;
      user = await this.userService.createUser(event.email);
    }
    // event to be handled by auth/magicLogin module
    this.eventEmitter.emit(
      'user.login',
      new UserLoginEvent(user.firstName, user.email, event.url, newUser),
    );
  }
}
