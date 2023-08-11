import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { OrgModule } from 'src/org/org.module';
import { ProjectModule } from 'src/project/project.module';
import { ItemModule } from 'src/item/item.module';

@Module({
  imports: [OrgModule, ProjectModule, ItemModule],
  providers: [AbilityFactory],
  exports: [AbilityFactory],
})
export class AbilityModule {}
