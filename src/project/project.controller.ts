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
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/ability/abilities.decorator';
import { UserRequestDto } from 'src/auth/dto/userRequest.dto';
import { Project } from './entities/project.entity';
import {
  CreateProjectAbility,
  DeleteProjectAbility,
  UpdateProjectAbility,
  ViewProjectAbility,
} from 'src/ability/ability.objects';

@Controller('org/:orgId/project')
@ApiTags('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get(':projectId')
  @CheckAbilities(new ViewProjectAbility())
  async getProject(@Param('projectId') projectId: string): Promise<Project> {
    return await this.projectService.getProject(projectId);
  }

  @Post()
  @CheckAbilities(new CreateProjectAbility())
  async createProject(
    @Req() req: UserRequestDto,
    @Param('orgId') orgId: string,
    @Body() newProject: CreateProjectDto,
  ): Promise<Project> {
    return await this.projectService.createProject(
      req.user.id,
      orgId,
      newProject,
    );
  }

  @Patch(':projectId')
  @CheckAbilities(new UpdateProjectAbility())
  async updateProject(
    @Param('projectId') projectId: string,
    @Body() changes: UpdateProjectDto,
  ): Promise<Project> {
    return await this.projectService.updateProject(projectId, changes);
  }

  @CheckAbilities(new DeleteProjectAbility())
  @Delete(':projectId')
  async deleteProject(
    @Req() req: UserRequestDto,
    @Param('projectId') projectId: string,
  ) {
    await this.projectService.deleteProject(req.user.id, projectId);
  }
}
