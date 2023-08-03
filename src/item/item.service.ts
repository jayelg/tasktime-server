import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './item.schema';
import { Project } from '../project/project.schema';
import mongoose, { Model } from 'mongoose';
import { newItem } from './item.interface';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel('Item') private readonly items: Model<Item>,
    @InjectModel('Project') private readonly projects: Model<Project>,
  ) {}

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
  async getItem(projectId: string, itemId: string) {
    const item = await this.items.findById(itemId);
    if (!item) {
      throw new NotFoundException(
        `Get Item Service: Item ${itemId} not found in project ${projectId}`,
      );
    }
    return item;
  }

  async createItem(projectId: string, newItem: newItem) {
    const formattedItem = await this.items.create({
      projectId: projectId,
      name: newItem.name,
      creator: newItem.creator,
      colour: newItem.colour,
      parentItemId: newItem.parentItemId || projectId,
      predecessorItemId: newItem.predecessorItemId,
      createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
      updatedAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
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
