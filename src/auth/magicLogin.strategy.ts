import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-magic-login';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';
// import { createTransport } from 'nodemailer';

@Injectable()
export class MagicLoginStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private authService: AuthService,
    private mailService: MailService,
    private userService: UserService,
  ) {
    super({
      secret: configService.get<string>('JWT_SECRET_KEY'),
      jwtOptions: {
        expiresIn: '5m',
      },
      callbackUrl: `${configService.get<string>(
        'SERVER_URL',
      )}:${configService.get<string>('PORT')}/auth/login/callback`,
      sendMagicLink: async (destination, href) => {
        console.log(`got email ${destination} and href ${href}`);
        await this.mailService.sendMagicLink(destination, href);
      },
      verify: async (payload, callback) => {
        callback(null, this.validate(payload));
      },
    });
  }

  // optional invite object
  // type is of 'org' or 'project'
  // (project auto adds user to org)
  validate(payload: { destination: string }) {
    const user = this.authService.validateUser(payload.destination);
    return user;
  }
}
