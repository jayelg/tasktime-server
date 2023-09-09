import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthValidateUserEvent } from './event/authValidate.event';
import { UserValidatedEvent } from 'src/user/event/userValidated.event';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  async generateTokens(user: { id: number; email: string }) {
    const payload = { id: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  extractPayload(token: string): any {
    return this.jwtService.decode(token);
  }

  async validateUser(email: string) {
    this.eventEmitter.emit(
      'auth.validateUser',
      new AuthValidateUserEvent(email),
    );
    const [userValidatedEvent] = await this.eventEmitter.waitFor(
      'user.validated',
      {
        handleError: false,
        timeout: 0,
        filter: (event: UserValidatedEvent) => event.user.email === email,
        Promise: Promise,
        overload: false,
      },
    );
    return userValidatedEvent.user;
  }
}
