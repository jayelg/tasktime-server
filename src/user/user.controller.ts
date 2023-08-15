import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserRequestDto } from './dto/updateUserRequest.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InviteToOrgDto } from './dto/inviteToOrg.dto';
import {
  CheckAbilities,
  ManageOrgAbility,
} from 'src/ability/abilities.decorator';
import { UserRequestDto } from 'src/auth/dto/userRequest.dto';
import { UserDto } from './dto/user.dto';

// This endpoint is used for own user profile
// Other users can be accessed through the 'org/:orgId/members/' endpoint
@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(@Req() req: UserRequestDto): Promise<UserDto> {
    return await this.userService.getUser(req.user.id);
  }

  @Patch()
  async updateUser(
    @Req() req: UserRequestDto,
    @Body() updates: UpdateUserRequestDto,
  ): Promise<UserDto> {
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

  @Patch('readNotification/:notificationId')
  async markNotificationRead(
    @Req() req,
    @Param('notificationId') notificationId: string,
  ) {
    await this.userService.removeUnreadNotification(
      req.user.id,
      notificationId,
    );
  }

  @Post('inviteTo/:orgId')
  @CheckAbilities(new ManageOrgAbility())
  async inviteUserToOrg(
    @Req() req,
    @Param('orgId') orgId: string,
    @Body() inviteData: InviteToOrgDto,
  ) {
    await this.userService.handleInvitedOrgMember(
      req.user.id,
      orgId,
      inviteData,
    );
  }
}
