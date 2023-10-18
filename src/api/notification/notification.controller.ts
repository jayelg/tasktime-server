import { Controller, Delete, Get, Param, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiTags } from '@nestjs/swagger';
import { UserRequestDto } from 'src/api/auth/dto/userRequest.dto';
import { Notification } from './entities/notification.entity';
import { API_PREFIX } from 'src/shared/config';

@Controller(`${API_PREFIX}/notification`)
@ApiTags('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':notificationId')
  async getNotification(
    @Req() req: UserRequestDto,
    @Param('notificationId') notificationId: string,
  ): Promise<Notification> {
    return await this.notificationService.getNotification(
      req.user.id,
      notificationId,
    );
  }

  @Delete(':notificationId')
  async deleteNotification(
    @Req() req: UserRequestDto,
    @Param('notificationId') notificationId: string,
  ) {
    await this.notificationService.deleteNotification(
      req.user.id,
      notificationId,
    );
  }
}
