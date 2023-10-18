import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { OrgModule } from 'src/api/org/org.module';
import { ProjectModule } from 'src/api/project/project.module';
import { ItemModule } from 'src/api/item/item.module';

@Module({
  imports: [OrgModule, ProjectModule, ItemModule],
  providers: [AbilityFactory],
  exports: [AbilityFactory],
})
export class AbilityModule {}
