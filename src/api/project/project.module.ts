import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/projectMember.entity';
import { ProjectRepository } from './repositories/project.repository';

@Module({
  imports: [MikroOrmModule.forFeature([Project, ProjectMember])],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
  exports: [ProjectService],
})
export class ProjectModule {}
