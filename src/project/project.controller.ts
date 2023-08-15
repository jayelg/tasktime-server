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
import { ApiTags } from '@nestjs/swagger';
import { IProject } from './interface/project.interface';
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

@Controller('org/:orgId/project')
@ApiTags('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get(':projectId')
  @CheckAbilities(new ViewProjectAbility())
  async getProject(@Req() req, @Param('projectId') projectId: string) {
    return await this.projectService.getProject(projectId);
  }

  // Todo: CheckAbilities on multiple Projects?
  // Permitting only orgAdmin access for now.
  @Get()
  @CheckAbilities(new ManageOrgAbility())
  async getSelectedProjects(
    @Req() req: UserRequestDto,
    @Body('projectId') body: SelectedProjectsDto,
  ): Promise<IProject[]> {
    return await this.projectService.getSelectedProjects(
      req.user.id,
      body.projectIds,
    );
  }

  @Post()
  @CheckAbilities(new CreateProjectAbility())
  async createProject(
    @Req() req: UserRequestDto,
    @Body() newProject: CreateProjectDto,
  ): Promise<IProject> {
    // todo implement authorization
    return await this.projectService.createProject(
      req.user.id,
      newProject.orgId,
      newProject,
    );
  }

  // no validated yet
  @Patch(':projectId')
  @CheckAbilities(new UpdateProjectAbility())
  async updateProject(
    @Req() req: UserRequestDto,
    @Param('projectId') projectId: string,
    @Body() changes: UpdateProjectDto,
  ) {
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
