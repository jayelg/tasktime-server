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
import { ItemService } from './item.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NewItemDto } from './dto/newItem.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  CheckAbilities,
  CreateItemAbility,
  DeleteItemAbility,
  UpdateItemAbility,
  ViewProjectAbility,
} from 'src/ability/abilities.decorator';
import { UpdateItemDto } from './dto/updateItem.dto';
import { Item } from './entities/item.entity';

@Controller('org/:orgId/projects/:projectId/items')
@ApiTags('items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  @CheckAbilities(new ViewProjectAbility())
  async getItems(@Body() itemIds: number[]) {
    return this.itemService.getItems(itemIds);
  }

  @Get(':itemId')
  @CheckAbilities(new ViewProjectAbility())
  async getItem(@Param('itemId') itemId: number): Promise<Item> {
    return this.itemService.getItem(itemId);
  }

  @Post()
  @CheckAbilities(new CreateItemAbility())
  async createItem(
    @Req() req,
    @Param('projectId') projectId: number,
    @Body() newItem: NewItemDto,
  ) {
    return await this.itemService.createItem(req.user._id, projectId, newItem);
  }

  @Patch(':itemId')
  @CheckAbilities(new UpdateItemAbility())
  async updateItem(
    @Param('itemId') itemId: number,
    @Body() changes: UpdateItemDto,
  ) {
    return await this.itemService.updateItem(itemId, changes);
  }

  @Delete(':itemId')
  @CheckAbilities(new DeleteItemAbility())
  async deleteItem(@Param('itemId') itemId: number) {
    return await this.itemService.deleteItem(itemId);
  }
}
