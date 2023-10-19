import { Module } from '@nestjs/common';
import { OrgController } from './org.controller';
import { OrgService } from './org.service';
import { OrgListenersService } from './listeners/orgListeners.service';
import { Org } from './entities/org.entity';
import { OrgMember } from './entities/orgMember.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OrgRepository } from './repositories/org.repository';

@Module({
  imports: [MikroOrmModule.forFeature([Org, OrgMember])],
  controllers: [OrgController],
  providers: [OrgService, OrgListenersService, OrgRepository],
  exports: [OrgService],
})
export class OrgModule {}
