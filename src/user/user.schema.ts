import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop({
    required: false,
    default: '',
  })
  email: string;

  @Prop({
    required: false,
    default: '',
  })
  firstName: string;

  @Prop({
    required: false,
    default: '',
  })
  lastName: string;

  // link to image
  @Prop({
    required: false,
    default: '',
  })
  avatar: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Org' }] })
  orgs: mongoose.Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }] })
  personalProjects: mongoose.Types.ObjectId[];

  @Prop()
  createdAt: string;

  @Prop()
  lastLoginAt: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  })
  unreadNotifications: mongoose.Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
  unreadMessages: mongoose.Types.ObjectId[];

  @Prop()
  disabled: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
