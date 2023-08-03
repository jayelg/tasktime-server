import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Item } from 'src/item/item.schema';

export type EventDocument = mongoose.HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop()
  date: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }] })
  completedItems: Item[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
