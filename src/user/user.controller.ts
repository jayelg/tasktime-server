import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserRequestDto } from 'src/auth/dto/userRequest.dto';
import { User } from './entities/user.entity';

// This endpoint is used for own user profile
// Other users can be accessed through the 'org/:orgId/members/' endpoint
@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(@Req() req: UserRequestDto): Promise<User> {
    return await this.userService.getUser(req.user.id);
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
    await this.userService.updateUser(req.user.id, { disabled: true });
  }

  @Patch('enable')
  async enableUser(@Req() req) {
    await this.userService.updateUser(req.user.id, { disabled: false });
  }
}
