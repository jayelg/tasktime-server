import { Controller, Delete, Get, Param, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiTags } from '@nestjs/swagger';
import { UserRequestDto } from 'src/auth/dto/userRequest.dto';
import { Notification } from './entities/notification.entity';

@Controller('notification')
@ApiTags('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':notificationId')
  async getNotification(
    @Req() req: UserRequestDto,
    @Param('notificationId') notificationId: number,
  ): Promise<Notification> {
    return await this.notificationService.getNotification(
      req.user.id,
      notificationId,
    );
  }

  @Delete(':notificationId')
  async deleteNotification(
    @Req() req: UserRequestDto,
    @Param('notificationId') notificationId: number,
  ) {
    await this.notificationService.deleteNotification(
      req.user.id,
      notificationId,
    );
  }
}
