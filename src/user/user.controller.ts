import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { NotificationService } from 'src/notification/notification.service';
import { UpdateUserRequestDto } from './dto/updateUserRequest.dto';

// This endpoint is used for own user profile
// Other users can be accessed through the 'org/:orgId/members/' endpoint
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get()
  async getProfile(@Req() req) {
    return await this.userService.getUser(req.userId);
  }

  // add DTO for acceptable updates
  @Patch()
  async updateUser(@Req() req, @Body() updates: UpdateUserRequestDto) {
    return await this.userService.updateUser(req.userId, updates);
  }

  @Delete()
  async deleteUser(@Req() req) {
    await this.userService.deleteUser(req.userId);
  }

  @Patch('readNotification/:notificationId')
  async markNotificationRead(
    @Req() req,
    @Param('notificationId') notificationId: string,
  ) {
    await this.userService.removeUnreadNotification(req.userId, notificationId);
    await this.notificationService.updateUnread(notificationId, false);
  }
}
