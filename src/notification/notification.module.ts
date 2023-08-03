import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from './notification.schema';
import { NotificationController } from './notification.controller';
import { UserService } from 'src/user/user.service';
import { UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [NotificationService, UserService],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
