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
import { CheckAbilities } from 'src/ability/abilities.decorator';
import { UpdateItemDto } from './dto/updateItem.dto';
import { Item } from './entities/item.entity';
import {
  CreateItemAbility,
  DeleteItemAbility,
  UpdateItemAbility,
  ViewItemAbility,
} from 'src/ability/ability.objects';
import { UserRequestDto } from 'src/auth/dto/userRequest.dto';

@Controller('org/:orgId/project/:projectId/item')
@ApiTags('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

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
}
