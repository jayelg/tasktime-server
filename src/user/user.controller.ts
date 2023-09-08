import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserRequestDto } from 'src/auth/dto/userRequest.dto';
import { getUserByEmailReq } from './dto/getUserByEmailReq.dto';
import { User } from './entities/user.entity';

// This endpoint is used for own user profile
// Other users can be accessed through the 'org/:orgId/members/' endpoint
@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(@Req() req: UserRequestDto): Promise<User> {
    console.log(req.user.id);
    return await this.userService.getUser(req.user.id);
  }

  // temp for testing
  @Get('byemail')
  async getUserByEmail(@Body() body: getUserByEmailReq): Promise<User> {
    return await this.userService.getUserByEmail(body.email);
  }

  @Patch()
  async updateUser(
    @Req() req: UserRequestDto,
    @Body() updates: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(req.user.id, updates);
  }

  @Patch('disable')
  async disableUser(@Req() req) {
    // send confirmation email
    await this.userService.updateUser(req.user.id, { disabled: true });
  }

  @Patch('enable')
  async enableUser(@Req() req) {
    // send confirmation email
    await this.userService.updateUser(req.user.id, { disabled: false });
  }
}
