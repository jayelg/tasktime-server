import { Module } from '@nestjs/common';
import { AuthModule } from 'src/api/auth/auth.module';
import { EventModule } from 'src/api/event/event.module';
import { ItemModule } from 'src/api/item/item.module';
import { MailModule } from 'src/api/mail/mail.module';
import { MessageModule } from 'src/api/message/message.module';
import { NotificationModule } from 'src/api/notification/notification.module';
import { OrgModule } from 'src/api/org/org.module';
import { ProjectModule } from 'src/api/project/project.module';
import { UserModule } from 'src/api/user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    OrgModule,
    ProjectModule,
    ItemModule,
    EventModule,
    MailModule,
    NotificationModule,
    MessageModule,
  ],
})
export class ApiModule {}
