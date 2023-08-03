import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ItemModule } from '../item/item.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from './project.schema';
import { OrgService } from 'src/org/org.service';
import { UserSchema } from 'src/user/user.schema';
import { OrgSchema } from 'src/org/org.schema';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    ItemModule,
    MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Org', schema: OrgSchema }]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, OrgService, UserService],
  exports: [ProjectService],
})
export class ProjectModule {}
