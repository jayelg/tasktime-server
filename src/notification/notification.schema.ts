import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type NotificationDocument = mongoose.HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;

  @Prop()
  createdAt: string;

  @Prop()
  unread: boolean;

  @Prop()
  title: string;

  @Prop()
  body: string;

  @Prop()
  button: string;

  // todo: restrict to 'orgInvite', 'toReview', 'Approval' etc.
  @Prop()
  type: string;

  // to contain reference to relevant objectId, eg. org._id for invite, item._id for reviews/approvals
  @Prop()
  reference: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
