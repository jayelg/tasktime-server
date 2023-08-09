import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async generateTokens(user: User) {
    const payload = { _id: user._id.toString(), email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  extractPayload(token: string): any {
    return this.jwtService.decode(token);
  }

  async validateUser(email: string) {
    [];
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      return await this.usersService.createUser(email);
    }
    return user;
  }
}
