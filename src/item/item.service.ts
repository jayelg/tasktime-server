import { Injectable, NotFoundException } from '@nestjs/common';
import { NewItemDto } from './dto/newItem.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ItemCreatedEvent } from './event/itemCreated.event';
import { EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Item } from './entities/item.entity';
import { ItemRepository } from './repositories/item.repository';
import { User } from 'src/user/entities/user.entity';
import { Project } from 'src/project/entities/project.entity';
import { ItemMember } from './entities/itemMember.entity';
import { ItemMemberRole } from './enum/itemMemberRole.enum';

@Injectable()
export class ItemService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Item)
    private readonly itemRepository: ItemRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async getAllItems(userId: string): Promise<Item[]> {
    try {
      const itemMembers = await this.itemRepository.findItemsByMemberId(userId);
      const itemRefs = itemMembers.map((itemMember) => itemMember.item);
      return await this.itemRepository.find(itemRefs);
    } catch (error) {
      throw error;
    }
  }

  // todo add check user and role authorization
  async getItem(itemId: string): Promise<Item> {
    try {
      return this.itemRepository.findOneOrFail(itemId);
    } catch (error) {
      throw new NotFoundException('item not found');
    }
  }

  async createItem(userId: string, projectId: string, newItem: NewItemDto) {
    const userRef = this.em.getReference(User, userId);
    const projectRef = this.em.getReference(Project, projectId);
    const item = new Item(userRef, projectRef, newItem.name);
    await this.em.persistAndFlush(item);
    const itemRef = this.em.getReference(Item, item.id);
    const itemMember = new ItemMember(userRef, itemRef, ItemMemberRole.Owner);
    await this.em.persistAndFlush(itemMember);
    this.eventEmitter.emit(
      'item.created',
      new ItemCreatedEvent(item.id, projectId, item.createdAt, userId),
    );
    return item;
  }

  async updateItem(itemId: string, updates: object) {
    try {
      const item = await this.itemRepository.findOne(itemId);
      this.itemRepository.assign(item, updates);
      await this.em.persistAndFlush(item);
      return item;
    } catch (error) {
      throw error;
    }
  }

  async deleteItem(itemId: string) {
    try {
      const itemMembers = await this.itemRepository.findMembersByItemId(itemId);
      await this.em.removeAndFlush(itemMembers);
      const item = await this.itemRepository.findOne(itemId);
      if (!item) {
        throw new Error(`Item with ID ${itemId} not found`);
      }
      await this.em.removeAndFlush(item);

      // this.eventEmitter.emit(
      //   'item.deleted',
      //   new ItemDeletedEvent(
      //     itemId,
      //     item.project.toJSON().id,
      //     new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
      //     item.creator.toJSON().id,
      //   ),
      // );
    } catch (error) {
      throw error;
    }
  }

  async getMember(userId: string, itemId: string) {
    return await this.itemRepository.findItemMember(userId, itemId);
  }
}
