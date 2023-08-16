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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CheckAbilities,
  CreateItemAbility,
  DeleteItemAbility,
  UpdateItemAbility,
  ViewProjectAbility,
} from 'src/ability/abilities.decorator';
import { IItem } from './interface/item.interface';
import { UpdateItemDto } from './dto/updateItem.dto';

@Controller('org/:orgId/projects/:projectId/items')
@ApiTags('items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  @CheckAbilities(new ViewProjectAbility())
  async getItems(@Body() itemIds: string[]) {
    return this.itemService.getItems(itemIds);
  }

  @Get(':itemId')
  @CheckAbilities(new ViewProjectAbility())
  async getItem(@Param('itemId') itemId: string): Promise<IItem> {
    return this.itemService.getItem(itemId);
  }

  @Post()
  @CheckAbilities(new CreateItemAbility())
  async createItem(
    @Req() req,
    @Param('projectId') projectId: string,
    @Body() newItem: NewItemDto,
  ) {
    const createdItem = await this.itemService.createItem(
      req.user._id,
      projectId,
      newItem,
    );

    // move to service
    // update parent nested item relationships
    if (createdItem.parentItemId.toString() !== projectId) {
      const parentItem = await this.itemService.getItem(newItem.parentItemId);
      const updatedNestedItemIds = {
        nestedItemIds: [
          ...parentItem.nestedItemIds,
          createdItem._id.toString(),
        ],
      };
      await this.itemService.updateItem(
        newItem.parentItemId,
        updatedNestedItemIds,
      );
    }
    // update predecessor item relationships
    if (newItem.predecessorItemId) {
      const changes = { successorItemId: createdItem._id.toString() };
      await this.itemService.updateItem(newItem.predecessorItemId, changes);
    }
    return createdItem;
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
}
