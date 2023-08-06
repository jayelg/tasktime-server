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
import { newProject } from './project.interface';
import { OrgService } from 'src/org/org.service';
import { UpdateProjectDto } from './project.dto';
import { ItemService } from 'src/item/item.service';
import { NewItemDto } from 'src/item/dto/newItem.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('project')
@ApiTags('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly orgService: OrgService,
    private readonly itemService: ItemService,
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
    const project = await this.projectService.deleteProject(
      req.userId,
      projectId,
    );
    await this.orgService.removeProject(req.userId, project.org, projectId);
  }

  @Post(':projectId/newItem')
  async newItem(
    @Req() req,
    @Param('projectId') projectId: string,
    @Body() newItem: NewItemDto,
  ) {
    const project = await this.itemService.createItem(
      req.userId,
      projectId,
      newItem,
    );
  }
}
