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
    description: 'Generated a JTW token for the authenticated user',
  })
  async callback(@Req() req) {
    return await this.authService.generateTokens(req.user);
  }
}