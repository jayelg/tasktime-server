import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type OrgDocument = mongoose.HydratedDocument<Org>;

@Schema()
export class Org {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    default: 'New Organisation',
  })
  name: string;

  @Prop()
  createdAt: string;

  @Prop()
  description: string;

  @Prop([
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: {
        type: String,
        enum: ['orgViewer', 'orgUser', 'orgProjectManager', 'orgAdmin'],
      },
    },
  ])
  members: { _id: mongoose.Types.ObjectId; role: string }[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }] })
  projects: mongoose.Types.ObjectId[];
}

export const OrgSchema = SchemaFactory.createForClass(Org);
