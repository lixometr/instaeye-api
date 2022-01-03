import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { Document } from 'mongoose';

export type InnerProxyDocument = InnerProxy & Document;

@Schema()
export class InnerProxy {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;


  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ required: true })
  host: string;

  @Prop({ required: true })
  port: number;

  @Prop()
  errorMessage: string;

  @Prop()
  usedDate: Date;
}

export const InnerProxySchema = SchemaFactory.createForClass(InnerProxy);
