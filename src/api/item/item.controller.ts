import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  Query,
} from '@nestjs/common';
import { ItemService } from './item.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NewItemDto } from './dto/newItem.dto';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/api/ability/abilities.decorator';
import { UpdateItemDto } from './dto/updateItem.dto';
import { Item } from './entities/item.entity';
import {
  CreateItemAbility,
  DeleteItemAbility,
  UpdateItemAbility,
  ViewItemAbility,
} from 'src/api/ability/ability.objects';
import { UserRequestDto } from 'src/api/auth/dto/userRequest.dto';
import { ItemDescendantsDto } from './dto/itemDescendants.dto';
import { ItemAncestryService } from './itemAncestry.service';
import { CreateItemAncestryDto } from './dto/createItemAncestry.dto';
import { ItemAncestry } from './entities/itemAncestry.entity';
import { API_PREFIX } from 'src/shared/config';

@Controller(`${API_PREFIX}/org/:orgId/project/:projectId/item`)
@ApiTags('item')
export class ItemController {
  constructor(
    private itemService: ItemService,
    private itemAncestryService: ItemAncestryService,
  ) {}

  @Get()
  @CheckAbilities(new ViewItemAbility())
  async getAllItems(@Req() req: UserRequestDto): Promise<Item[]> {
    return this.itemService.getAllItems(req.user.id);
  }

  @Get(':itemId')
  @CheckAbilities(new ViewItemAbility())
  async getItem(@Param('itemId') itemId: string): Promise<Item> {
    return this.itemService.getItem(itemId);
  }

  @Post()
  @CheckAbilities(new CreateItemAbility())
  async createItem(
    @Req() req: UserRequestDto,
    @Param('projectId') projectId: string,
    @Body() newItem: NewItemDto,
  ) {
    return await this.itemService.createItem(req.user.id, projectId, newItem);
  }

  @Patch(':itemId')
  @CheckAbilities(new UpdateItemAbility())
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() changes: UpdateItemDto,
  ) {
    return await this.itemService.updateItem(itemId, changes);
  }

  @Delete(':itemId')
  @CheckAbilities(new DeleteItemAbility())
  async deleteItem(@Param('itemId') itemId: string) {
    return await this.itemService.deleteItem(itemId);
  }

  // Ancestry Related
  @Get(':itemId/descendants')
  @CheckAbilities(new ViewItemAbility())
  async getItemDescendants(
    @Param('itemId') itemId: string,
    @Query('depth') depth?: string,
  ): Promise<ItemDescendantsDto> {
    return this.itemAncestryService.getItemDescendants(
      itemId,
      parseInt(depth, 10),
    );
  }

  @Post('relationship')
  @CheckAbilities(new CreateItemAbility())
  async createItemAncestry(
    @Body() newItem: CreateItemAncestryDto,
  ): Promise<ItemAncestry> {
    return await this.itemAncestryService.createItemAncestry(newItem);
  }

  @Delete('relationship/:itemAncestryId')
  @CheckAbilities(new DeleteItemAbility())
  async deleteItemAncestry(
    @Param('itemAncestryId') itemAncestryId: string,
  ): Promise<undefined> {
    await this.itemAncestryService.deleteItemAncestry(itemAncestryId);
  }
}
