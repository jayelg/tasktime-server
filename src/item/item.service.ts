import { Injectable, NotFoundException } from '@nestjs/common';
import { NewItemDto } from './dto/newItem.dto';
import { IItem } from './interface/item.interface';
import { ItemDto } from './dto/item.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ItemCreatedEvent } from './event/itemCreated.event';
import { ItemDeletedEvent } from './event/itemDeleted.event';
import { EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Item } from './entities/item.entity';
import { ItemRepository } from './repositories/item.repository';
import { Reference } from '@mikro-orm/core';
import { User } from 'src/user/entities/user.entity';
import { Project } from 'src/project/entities/project.entity';

@Injectable()
export class ItemService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Item)
    private readonly itemRepository: ItemRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  // private itemDocToIitem(itemDoc: ItemDocument): IItem {
  //   const item: IItem = {
  //     ...itemDoc.toJSON(),
  //     // convert all objectId types to strings
  //     _id: itemDoc._id.toString(),
  //     project: itemDoc.project.toString(),
  //     allocatedTo: itemDoc.allocatedTo.map((user) => user.toString()),
  //     reviewers: itemDoc.reviewers.map((reviewer) => reviewer.toString()),
  //     nestedItemIds: itemDoc.nestedItemIds.map((nestedItemId) =>
  //       nestedItemId.toString(),
  //     ),
  //     parentItemId: itemDoc.parentItemId.toString(),
  //     predecessorItemId: itemDoc.parentItemId.toString(),
  //     successorItemId: itemDoc.parentItemId.toString(),
  //     itemObjects: itemDoc.itemObjects.map((itemObject) =>
  //       itemObject.toString(),
  //     ),
  //   };
  //   return item;
  // }

  async getItems(itemIds: number[]): Promise<Item[]> {
    const qb = this.itemRepository.createQueryBuilder();
    qb.where({ id: { $in: itemIds } });
    return await qb.getResult();
  }

  // todo add check user and role authorization
  async getItem(itemId: number): Promise<Item> {
    return this.itemRepository.findOne(itemId);
  }

  async createItem(userId: number, projectId: number, newItem: NewItemDto) {
    const item = new Item();
    item.creator = Reference.createFromPK(User, userId);
    item.project = Reference.createFromPK(Project, projectId);
    item.name = newItem.name;
    item.colour = newItem.colour;
    await this.em.persistAndFlush(item);
    this.eventEmitter.emit(
      'item.created',
      new ItemCreatedEvent(item.id, projectId, item.createdAt, userId),
    );
    return item;
  }

  async updateItem(itemId: number, updates: object) {
    try {
      const item = await this.itemRepository.findOne(itemId);
      this.itemRepository.assign(item, updates);
      await this.em.persistAndFlush(item);
      return item;
    } catch (error) {
      throw error;
    }
  }

  async deleteItem(itemId: number) {
    const item = await this.itemRepository.findOne(itemId);
    if (!item) {
      throw new Error(`Project with ID ${itemId} not found`);
    }
    await this.em.removeAndFlush(item);
    this.eventEmitter.emit(
      'item.deleted',
      new ItemDeletedEvent(
        itemId,
        item.project.unwrap().id,
        new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
        item.creator.unwrap().id,
      ),
    );
  }
}
