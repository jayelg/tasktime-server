import { Options } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';
import { Item } from './item/entities/item.entity';
import { ItemMember } from './item/entities/itemMember.entity';
import { User } from './user/entities/user.entity';
import { Org } from './org/entities/org.entity';
import { OrgMember } from './org/entities/orgMember.entity';
import { Project } from './project/entities/project.entity';
import { ProjectMember } from './project/entities/projectMember.entity';
import { CustomBaseEntity } from './shared/entities/customBase.entity';
import { Notification } from './notification/entities/notification.entity';

export default (configService: ConfigService): Options => {
  return {
    debug: true,
    entities: [
      CustomBaseEntity,
      User,
      Org,
      OrgMember,
      Project,
      ProjectMember,
      Item,
      ItemMember,
      Notification,
    ],
    type: 'postgresql',
    dbName: 'tasktimedev',
    user: 'postgres',
    password: 'm%DLMwTX&xq9LMTb7CvH',
    host: '172.20.0.2',
    port: 5432,
    // dbName: configService.get('DB_NAME'),
    // user: configService.get('DB_USER'),
    // password: configService.get('DB_PASS'),
    // host: configService.get('DB_HOST'),
    // port: configService.get('DB_PORT'),
  };
};
