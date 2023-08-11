import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item, ItemDocument } from './item.schema';
import { Project } from '../project/project.schema';
import mongoose, { Model, Types } from 'mongoose';
import { NewItemDto } from './dto/newItem.dto';
import { IItem } from './interface/item.interface';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel('Item') private readonly items: Model<Item>,
    @InjectModel('Project') private readonly projects: Model<Project>,
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

  async getAllItems(projectId: string) {
    const populatedProject = await this.projects
      .findById(projectId)
      .populate('items');
    if (!populatedProject) {
      throw new NotFoundException(
        `Get All Items Service: Project ${projectId} not found`,
      );
    }
    return populatedProject.items;
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

    try {
      await this.projects.updateOne(
        { _id: projectId },
        { $push: { items: formattedItem.toObject() } },
      );
      return formattedItem;
    } catch (error) {
      throw error;
    }
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

  async deleteItem(projectId: string, itemId: string) {
    const project = await this.projects.findById(projectId);
    if (!project) {
      throw new NotFoundException(
        `Delete Item Service: Project ${projectId} not found`,
      );
    }
    const itemIndex = project.items.findIndex(
      (item: mongoose.Types.ObjectId) => item.toString() === itemId,
    );
    if (itemIndex === -1) {
      throw new NotFoundException(
        `Delete Item Service: Item ${itemId} not found`,
      );
    }
    project.items.splice(itemIndex, 1);
    try {
      await project.save();
    } catch (error) {
      throw error;
    }
  }

  async deleteAllItems(projectId: string) {
    const project = await this.projects.findById(projectId);
    if (!project) {
      throw new NotFoundException(
        `Delete All Items Service: Project ${projectId} not found`,
      );
    }
    project.items = [];
    await project.save();
  }
}
