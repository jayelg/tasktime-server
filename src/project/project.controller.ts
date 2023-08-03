import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from './project.schema';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { newProject } from './project.interface';
import { OrgService } from 'src/org/org.service';
import mongoose from 'mongoose';
import { UpdateProjectDto } from './project.dto';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly orgService: OrgService,
  ) {}

  @Get(':projectId')
  async getProject(@Req() req, @Param('projectId') projectId: string) {
    return await this.projectService.getProject(req.userId, projectId);
  }

  // no validated yet
  @Patch(':projectId')
  async updateProject(
    @Req() req,
    @Param('projectId') projectId: string,
    @Body() changes: UpdateProjectDto,
  ) {
    return await this.projectService.updateProject(
      req.userId,
      projectId,
      changes,
    );
  }

  @Delete(':projectId')
  async deleteProject(@Req() req, @Param('projectId') projectId: string) {
    return await this.projectService.deleteProject(req.userId, projectId);
  }
}
