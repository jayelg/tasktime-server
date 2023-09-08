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
import {
  CheckAbilities,
  CreateOrgAbility,
  DeleteOrgAbility,
  UpdateOrgAbility,
  ViewOrgAbility,
} from 'src/ability/abilities.decorator';
import { UserRequestDto } from 'src/auth/dto/userRequest.dto';
import { Org } from './entities/org.entity';

@Controller('org')
@ApiTags('org')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  @Post()
  @CheckAbilities(new CreateOrgAbility())
  async createOrg(@Req() req, @Body() newOrg: CreateOrgDto): Promise<Org> {
    return await this.orgService.createOrg(req.user.id, newOrg);
  }

  @Get(':orgId')
  @ApiOperation({ summary: 'Get an organization by ID' })
  @ApiResponse({ status: 200, description: 'The organization', type: OrgDto })
  @CheckAbilities(new ViewOrgAbility())
  async getOrg(
    @Req() req: UserRequestDto,
    @Param('orgId') orgId: number,
  ): Promise<Org> {
    return await this.orgService.getOrg(orgId);
  }

  // todo:
  // still no error when property is not in schema, just returns without changes.
  @Patch(':orgId')
  @CheckAbilities(new UpdateOrgAbility())
  async updateOrg(
    @Req() req: UserRequestDto,
    @Param('orgId') orgId: number,
    @Body() orgUpdates: UpdateOrgDto,
  ): Promise<Org> {
    return await this.orgService.updateOrg(orgId, orgUpdates);
  }

  @CheckAbilities(new DeleteOrgAbility())
  @Delete(':orgId')
  async deleteOrg(@Req() req: UserRequestDto, @Param('orgId') orgId: number) {
    return await this.orgService.deleteOrg(orgId);
  }

  /*    :orgId/member    */

  @Post(':orgId/member/acceptInvite')
  async acceptInvite(@Req() req, @Param('orgId') orgId: number) {
    await this.orgService.acceptInvite(req.user.id, orgId);
  }

  @Get(':orgId/member/:memberId')
  async getMember(
    @Req() req,
    @Param('orgId') orgId: number,
    @Param('memberId') memberId: number,
  ) {
    return await this.orgService.getMember(memberId, orgId);
  }

  @Delete(':orgId/member/:memberId')
  async removeMember(
    @Req() req,
    @Param('orgId') orgId: number,
    @Param('memberId') memberId: number,
  ) {
    try {
      await this.orgService.removeMember(req.user.id, orgId, memberId);
    } catch (error) {
      throw error;
    }
  }
}
