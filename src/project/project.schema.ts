import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ProjectDocument = mongoose.HydratedDocument<Project>;

@Schema()
export class Project {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Org' })
  org: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    default: 'New Project',
  })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: mongoose.Types.ObjectId;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;

  @Prop()
  description: string;

  @Prop([
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: {
        type: String,
        enum: ['projectViewer', 'projectUser', 'projectAdmin'],
      },
    },
  ])
  members: { _id: mongoose.Types.ObjectId; role: string }[];

  @Prop({
    required: true,
    default: 0,
  })
  timeAllocated: number;

  @Prop({
    required: true,
    default: false,
  })
  isComplete: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] })
  events: mongoose.Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }] })
  items: mongoose.Types.ObjectId[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
