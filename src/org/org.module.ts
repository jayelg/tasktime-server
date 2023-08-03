import { Module } from '@nestjs/common';
import { OrgController } from './org.controller';
import { OrgService } from './org.service';
import { ProjectModule } from '../project/project.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OrgSchema } from './org.schema';
import { UserSchema } from 'src/user/user.schema';
import { UserModule } from 'src/user/user.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    UserModule,
    ProjectModule,
    NotificationModule,
    MongooseModule.forFeature([{ name: 'Org', schema: OrgSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [OrgController],
  providers: [OrgService],
  exports: [OrgService],
})
export class OrgModule {}
