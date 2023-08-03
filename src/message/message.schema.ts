import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type MessageDocument = mongoose.HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  recipient: mongoose.Types.ObjectId;

  @Prop()
  createdAt: string;

  @Prop()
  read: boolean;

  @Prop()
  title: string;

  @Prop()
  body: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
