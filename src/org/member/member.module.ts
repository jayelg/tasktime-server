import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { UserService } from 'src/user/user.service';
import { OrgService } from '../org.service';
import { NotificationService } from 'src/notification/notification.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [MemberController],
  providers: [UserService, OrgService, NotificationService, MailService],
})
export class MemberModule {}
