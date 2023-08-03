import { Controller, Delete, Get, Param, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UserService } from 'src/user/user.service';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) {}

  @Get(':notificationId')
  async getNotification(
    @Req() req,
    @Param('notificationId') notificationId: string,
  ) {
    const note = await this.notificationService.getNotification(
      req.userId,
      notificationId,
    );
    return note;
  }

  // Should notifications be kept forever?
  @Delete(':notificationId')
  async deleteNotification(
    @Req() req,
    @Param('notificationId') notificationId: string,
  ) {
    console.log('remove from user');
    const user = await this.userService.removeUnreadNotification(
      req.userId,
      notificationId,
    );
    console.log('remove notification');
    await this.notificationService.deleteNotification(user, notificationId);
  }
}
