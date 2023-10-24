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
import { SkipAuth } from '../../shared/decorators/SkipAuth.decorator';
import { MagicLoginStrategy } from './magicLogin.strategy';
import { PasswordlessLoginDto } from './passwordless-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { API_PREFIX } from 'src/shared/config';

@Controller(`${API_PREFIX}/auth`)
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private magicLoginstrategy: MagicLoginStrategy,
  ) {}

  @SkipAuth()
  @Post('login')
  @ApiOperation({ summary: 'Initiate passwordless login' })
  @ApiResponse({ status: 200, description: 'Redirect URL for magic link' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@Req() req, @Res() res, @Body() body: PasswordlessLoginDto) {
    return this.magicLoginstrategy.send(req, res);
  }

  @SkipAuth()
  @UseGuards(AuthGuard('magiclogin'))
  @Get('login/callback')
  @ApiOperation({ summary: 'Callback URL for magic link login' })
  @ApiResponse({
    status: 200,
    description:
      'Return a cookie containing a JTW token for the authenticated user',
  })
  async callback(@Req() req, @Res() res) {
    const token = await this.authService.generateTokens(req.user);
    res.cookie('jwt', token.access_token, {
      httpOnly: true,
      // If you want the cookie to be secure (i.e., only transmitted over HTTPS)
      // secure: process.env.NODE_ENV !== 'development',
      maxAge: 1000 * 60 * 60, // 1 hour
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hours from now
    });
    res.send({ auth: true });
  }

  @Get('login/check')
  // @ApiOperation({ summary: 'Checks validity of JWT in cookie })
  // @ApiResponse({
  //   status: 200,
  //   description:
  //     'Returns auth: true if jwt is valid',
  // })
  async loginCheck(@Res() res) {
    res.send({ auth: true });
  }

  @Post('logout')
  logout(@Res() res) {
    res.clearCookie('jwt', { path: '/' });
    return res.send({ loggedOut: true });
  }
}
