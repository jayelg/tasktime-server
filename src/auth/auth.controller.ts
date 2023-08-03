import {
  Controller,
  Req,
  Res,
  Post,
  Get,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SkipAuth } from './SkipAuth.decorator';
import { MagicLoginStrategy } from './magicLogin.strategy';
import { PasswordlessLoginDto } from './passwordless-login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private magicLoginstrategy: MagicLoginStrategy,
  ) {}

  @SkipAuth()
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@Req() req, @Res() res, @Body() body: PasswordlessLoginDto) {
    // no need to validate as user is either validated or created after magic link suceeds.
    // this.authService.validateUser(body.destination);
    return this.magicLoginstrategy.send(req, res);
  }

  @SkipAuth()
  @UseGuards(AuthGuard('magiclogin'))
  @Get('login/callback')
  async callback(@Req() req) {
    return await this.authService.generateTokens(req.user);
  }
}
