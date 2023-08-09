import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserRequestDto } from './dto/updateUserRequest.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrgDto } from 'src/org/dto/org.dto';

// This endpoint is used for own user profile
// Other users can be accessed through the 'org/:orgId/members/' endpoint
@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(@Req() req) {
    return await this.userService.getUser(req.userId);
  }

  // add DTO for acceptable updates
  @Patch()
  async updateUser(@Req() req, @Body() updates: UpdateUserRequestDto) {
    return await this.userService.updateUser(req.userId, updates);
  }

  @Patch('disable')
  async disableUser(@Req() req) {
    // send confirmation email
    await this.userService.updateUser(req.userId, { disabled: true });
  }

  @Patch('enable')
  async enableUser(@Req() req) {
    // send confirmation email
    await this.userService.updateUser(req.userId, { disabled: false });
  }

  @Get('allorgs')
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({
    status: 200,
    description: 'Array of organizations',
    type: [OrgDto],
  })
  async getAllOrgs(@Req() req): Promise<string[]> {
    const { orgs } = await this.userService.getUser(req.userId);
    if (!orgs) {
      return [];
    }
    return orgs;
  }

  @Patch('readNotification/:notificationId')
  async markNotificationRead(
    @Req() req,
    @Param('notificationId') notificationId: string,
  ) {
    await this.userService.removeUnreadNotification(req.userId, notificationId);
  }
}
