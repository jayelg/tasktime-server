import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { OrgModule } from 'src/org/org.module';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [OrgModule, ProjectModule],
  providers: [AbilityFactory],
  exports: [AbilityFactory],
})
export class AbilityModule {}
