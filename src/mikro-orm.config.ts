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
import { ItemAncestry } from './item/entities/itemAncestry.entity';

export default (configService: ConfigService): Options => {
  return {
    // debug: true,
    entities: [
      CustomBaseEntity,
      User,
      Org,
      OrgMember,
      Project,
      ProjectMember,
      Item,
      ItemMember,
      ItemAncestry,
      Notification,
    ],
    type: 'postgresql',
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
  };
};
