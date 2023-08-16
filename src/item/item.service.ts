import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item, ItemDocument } from './item.schema';
import mongoose, { Model, Types } from 'mongoose';
import { NewItemDto } from './dto/newItem.dto';
import { IItem } from './interface/item.interface';
import { ItemDto } from './dto/item.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ItemCreatedEvent } from './event/itemCreated.event';
import { ItemDeletedEvent } from './event/itemDeleted.event';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel('Item') private readonly items: Model<Item>,
    private eventEmitter: EventEmitter2,
  ) {}

  private itemDocToIitem(itemDoc: ItemDocument): IItem {
    const item: IItem = {
      ...itemDoc.toJSON(),
      // convert all objectId types to strings
      _id: itemDoc._id.toString(),
      project: itemDoc.project.toString(),
      allocatedTo: itemDoc.allocatedTo.map((user) => user.toString()),
      reviewers: itemDoc.reviewers.map((reviewer) => reviewer.toString()),
      nestedItemIds: itemDoc.nestedItemIds.map((nestedItemId) =>
        nestedItemId.toString(),
      ),
      parentItemId: itemDoc.parentItemId.toString(),
      predecessorItemId: itemDoc.parentItemId.toString(),
      successorItemId: itemDoc.parentItemId.toString(),
      itemObjects: itemDoc.itemObjects.map((itemObject) =>
        itemObject.toString(),
      ),
    };
    return item;
  }

  async getItems(itemIds: string[]) {
    const itemDocs = await this.items.find({ _id: { $in: itemIds } }).exec();
    return itemDocs.map((item) => new ItemDto(item));
  }

  // todo add check user and role authorization
  async getItem(itemId: string): Promise<IItem> {
    return this.itemDocToIitem(await this.items.findById(itemId));
  }

  async createItem(userId: string, projectId: string, newItem: NewItemDto) {
    const formattedItem = await this.items.create({
      projectId: new Types.ObjectId(projectId),
      name: newItem.name,
      creator: new Types.ObjectId(userId),
      description: newItem.description || '',
      createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
      updatedAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
      allocatedTo: newItem.allocatedTo
        ? newItem.allocatedTo.map(
            (allocatedUser) => new Types.ObjectId(allocatedUser),
          )
        : [new Types.ObjectId(userId)], // fallback to userId if none provided
      timeAllocated: newItem.timeAllocated,
      colour: newItem.colour,
      parentItemId: new Types.ObjectId(newItem.parentItemId || projectId),
      predecessorItemId: new Types.ObjectId(
        newItem.predecessorItemId || projectId,
      ),
    });
    this.eventEmitter.emit(
      'item.created',
      new ItemCreatedEvent(
        formattedItem._id.toString(),
        formattedItem.project.toString(),
        formattedItem.createdAt,
        formattedItem.creator.toString(),
      ),
    );
    return formattedItem;
  }

  async updateItem(itemId: string, changes: object) {
    const item = await this.items.findByIdAndUpdate(itemId, changes);

    if (!item) {
      throw new NotFoundException(
        `Update Item Service: Item ${itemId} not found`,
      );
    }

    try {
      return await this.items.updateOne({ _id: itemId }, { $set: changes });
    } catch (error) {
      throw error;
    }
  }

  async deleteItem(itemId: string) {
    const item = await this.items.findByIdAndDelete(itemId);
    this.eventEmitter.emit(
      'item.created',
      new ItemDeletedEvent(
        itemId,
        item.project.toString(),
        new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
        item.creator.toString(),
      ),
    );
    // implement in the project service
    // const itemIndex = project.items.findIndex(
    //   (item: mongoose.Types.ObjectId) => item.toString() === itemId,
    // );
    // if (itemIndex === -1) {
    //   throw new NotFoundException(
    //     `Delete Item Service: Item ${itemId} not found`,
    //   );
    // }
    // project.items.splice(itemIndex, 1);
    // try {
    //   await project.save();
    // } catch (error) {
    //   throw error;
    // }
  }
}
