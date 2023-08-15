import { Controller, Delete, Get, Param, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRequestDto } from 'src/auth/dto/userRequest.dto';

@Controller('notification')
@ApiTags('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':notificationId')
  async getNotification(
    @Req() req: UserRequestDto,
    @Param('notificationId') notificationId: string,
  ) {
    const note = await this.notificationService.getNotification(
      req.user.id,
      notificationId,
    );
    return note;
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
