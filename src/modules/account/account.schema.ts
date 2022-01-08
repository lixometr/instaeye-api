import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema()
export class Account {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop()
  name?: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  photo?: string;

  @Prop([String])
  gallery?: string[];

  @Prop()
  age?: number;

  @Prop()
  // 1 - male, 2 - female, 0 - unknown
  gender?: number;

  @Prop()
  description?: string;

  @Prop()
  followers: number;

  @Prop()
  location?: string;

  @Prop({ default: 0 })
  likes: number;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
AccountSchema.index({
  name: 'text',
  description: 'text',
  username: 'text',
  location: 'text',
});
