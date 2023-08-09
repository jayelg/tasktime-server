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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IProject } from './interface/project.interface';
import { SelectedProjectsDto } from './dto/selectedProjects.dto';

@Controller('project')
@ApiTags('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get(':projectId')
  async getProject(@Req() req, @Param('projectId') projectId: string) {
    return await this.projectService.getProject(req.userId, projectId);
  }

  @Get(':projectId')
  async getSelectedProjects(
    @Req() req,
    @Body('projectId') body: SelectedProjectsDto,
  ): Promise<IProject[]> {
    return await this.projectService.getSelectedProjects(
      req.userId,
      body.projectIds,
    );
  }

  @Post()
  async createProject(
    @Req() req,
    @Body() newProject: CreateProjectDto,
  ): Promise<IProject> {
    // todo implement authorization
    return await this.projectService.createProject(
      req.userId,
      newProject.orgId,
      newProject,
    );
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
    await this.projectService.deleteProject(req.userId, projectId);
  }
}
