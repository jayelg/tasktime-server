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
import { SelectedProjectsDto } from './dto/selectedProjects.dto';
import {
  CheckAbilities,
  CreateProjectAbility,
  DeleteProjectAbility,
  ManageOrgAbility,
  UpdateProjectAbility,
  ViewProjectAbility,
} from 'src/ability/abilities.decorator';
import { UserRequestDto } from 'src/auth/dto/userRequest.dto';
import { Project } from './entities/project.entity';

@Controller('org/:orgId/project')
@ApiTags('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get(':projectId')
  @CheckAbilities(new ViewProjectAbility())
  async getProject(@Param('projectId') projectId: number): Promise<Project> {
    return await this.projectService.getProject(projectId);
  }

  // Todo: CheckAbilities on multiple Projects?
  // Permitting only orgAdmin access for now.
  @Get()
  @CheckAbilities(new ManageOrgAbility())
  async getSelectedProjects(
    @Body('projectId') body: SelectedProjectsDto,
  ): Promise<Project[]> {
    return await this.projectService.getSelectedProjects(body.projectIds);
  }

  @Post()
  @CheckAbilities(new CreateProjectAbility())
  async createProject(
    @Req() req: UserRequestDto,
    @Body() newProject: CreateProjectDto,
  ): Promise<Project> {
    return await this.projectService.createProject(
      req.user.id,
      newProject.orgId,
      newProject,
    );
  }

  @Patch(':projectId')
  @CheckAbilities(new UpdateProjectAbility())
  async updateProject(
    @Param('projectId') projectId: number,
    @Body() changes: UpdateProjectDto,
  ): Promise<Project> {
    return await this.projectService.updateProject(projectId, changes);
  }

  @CheckAbilities(new DeleteProjectAbility())
  @Delete(':projectId')
  async deleteProject(
    @Req() req: UserRequestDto,
    @Param('projectId') projectId: number,
  ) {
    await this.projectService.deleteProject(req.user.id, projectId);
  }
}
