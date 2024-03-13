import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDoc = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  ho: string;

  @Prop()
  ten: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

