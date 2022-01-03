import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { InnerProxy } from '../inner-proxy/inner-proxy.schema';
export type InnerAccountDocument = InnerAccount & Document;

@Schema()
export class InnerAccount {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'InnerProxy' })
  proxy: InnerProxy;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ required: false })
  email?: string;

  @Prop({ required: false })
  emailPassword?: string;

  @Prop()
  status?: number;

  @Prop()
  isActive: boolean;

  @Prop({ required: false })
  usedDate?: Date;

  @Prop()
  usedTimes?: number;

  @Prop()
  errorMessage?: string;
}

export const InnerAccountSchema = SchemaFactory.createForClass(InnerAccount);
