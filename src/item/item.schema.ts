import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ItemDocument = mongoose.HydratedDocument<Item>;

@Schema()
export class Item {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  project: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    default: '',
  })
  name: string;

  @Prop()
  creator: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;

  @Prop()
  description: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    default: () => [],
  })
  allocatedTo: mongoose.Types.ObjectId[];

  @Prop({
    required: false,
  })
  timeAllocated: number;

  @Prop({
    required: true,
    default: 0,
  })
  timeSpent: number;

  @Prop({
    required: true,
    default: false,
  })
  isComplete: boolean;

  @Prop({
    required: true,
    default: false,
  })
  reqReview: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  })
  reviewers: mongoose.Types.ObjectId[];

  @Prop({
    required: true,
  })
  colour: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    required: true,
    default: () => [],
  })
  nestedItemIds: mongoose.Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  })
  parentItemId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
  })
  predecessorItemId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
  })
  successorItemId: mongoose.Types.ObjectId;

  @Prop({
    required: false,
    default: () => [],
  })
  itemObjects: object[];
}

export const ItemSchema = SchemaFactory.createForClass(Item);
