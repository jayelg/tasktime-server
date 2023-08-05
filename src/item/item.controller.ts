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
import { Item } from './item.schema';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NewItemDto } from './dto/newItem.dto';

@Controller('org/:orgId/projects/:projectId/items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  // replace with class-validator dto
  private checkRequest(
    requiredProps: string[],
    request: any,
    optionalProps: string[] = [],
  ) {
    const missingProps = [];
    const invalidProps = [];
    const allowedProps = [...requiredProps, ...optionalProps];
    for (const property of requiredProps) {
      if (!request.hasOwnProperty(property) || !request[property]) {
        missingProps.push(property);
      }
    }
    if (allowedProps.length > 0) {
      for (const property in request) {
        if (!allowedProps.includes(property)) {
          invalidProps.push(property);
        }
      }
    }
    if (missingProps.length > 0 || invalidProps.length > 0) {
      throw new Error(
        (missingProps.length > 0
          ? 'The following properties are missing: ' +
            missingProps.join(', ') +
            '. '
          : '') +
          (invalidProps.length > 0
            ? 'The following properties are either not valid or cannot be modified: ' +
              invalidProps.join(', ') +
              '.'
            : ''),
      );
    }
  }

  @Get()
  async getAllItems(@Param('projectId') projectId: string) {
    return this.itemService.getAllItems(projectId);
  }

  @Get(':itemId')
  async getItems(
    @Param('projectId') projectId: string,
    @Param('itemId') itemId: string,
  ): Promise<Item> {
    const requiredProps = ['projectId', 'itemId'];
    this.checkRequest(requiredProps, { projectId: projectId, itemId: itemId });
    return this.itemService.getItem(projectId, itemId);
  }

  @Post()
  async createItem(
    @Req() req,
    @Param('projectId') projectId: string,
    @Body() newItem: NewItemDto,
  ) {
    const requiredProps = ['name', 'creator', 'colour'];
    const optionalProps = ['parentItemId', 'predecessorItemId'];
    this.checkRequest(requiredProps, newItem, optionalProps);
    const createdItem = await this.itemService.createItem(
      req.userId,
      projectId,
      newItem,
    );

    // update parent nested item relationships
    if (createdItem.parentItemId.toString() !== projectId) {
      const parentItem = await this.itemService.getItem(
        projectId,
        newItem.parentItemId,
      );
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
  async updateItem(
    @Param('projectId') projectId: string,
    @Param('itemId') itemId: string,
    @Body() changes: object,
  ) {
    return await this.itemService.updateItem(itemId, changes);
  }

  @Delete(':itemId')
  async deleteItem(
    @Param('projectId') projectId: string,
    @Param('itemId') itemId: string,
  ) {
    return await this.itemService.deleteItem(projectId, itemId);
  }

  @Delete()
  async deleteAllItems(@Param('projectId') projectId: string) {
    return await this.itemService.deleteAllItems(projectId);
  }
}
