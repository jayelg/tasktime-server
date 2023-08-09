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

//Services
import { OrgService } from './org.service';

// DTO
import { CreateOrgDto } from './dto/createOrg.dto';
import { UpdateOrgDto } from './dto/updateOrg.dto';
// Interface
import { IOrg } from './interface/org.interface';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrgDto } from './dto/org.dto';

@Controller('org')
@ApiTags('org')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  @Post()
  async createOrg(@Req() req, @Body() newOrg: CreateOrgDto): Promise<IOrg> {
    const org = await this.orgService.createOrg(req.userId, newOrg);
    return org;
  }

  @Get(':orgId')
  @ApiOperation({ summary: 'Get an organization by ID' })
  @ApiResponse({ status: 200, description: 'The organization', type: OrgDto })
  async getOrg(@Req() req, @Param('orgId') orgId: string): Promise<OrgDto> {
    return await this.orgService.getOrg(req.userId, orgId);
  }

  // todo:
  // still no error when property is not in schema, just returns without changes.
  @Patch(':orgId')
  async updateOrg(
    @Req() req,
    @Param('orgId') orgId: string,
    @Body() orgUpdates: UpdateOrgDto,
  ): Promise<IOrg> {
    const internalOrgUpdates: UpdateOrgDto = orgUpdates;
    return await this.orgService.updateOrg(
      req.userId,
      orgId,
      internalOrgUpdates,
    );
  }

  @Delete(':orgId')
  async deleteOrg(@Req() req, @Param('orgId') orgId: string) {
    return await this.orgService.deleteOrg(req.userId, orgId);
  }

  @Get(':orgId/projects')
  async getAllProjects(
    @Req() req,
    @Param('orgId') orgId: string,
  ): Promise<string[]> {
    const { projects } = await this.orgService.getOrg(req.userId, orgId);
    return projects;
  }
}
