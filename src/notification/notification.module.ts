import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Notification } from './entities/notification.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Notification])],
  providers: [NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
