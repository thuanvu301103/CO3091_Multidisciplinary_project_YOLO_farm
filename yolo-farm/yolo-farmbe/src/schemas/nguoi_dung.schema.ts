import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type Nguoi_dungDocument = HydratedDocument<Nguoi_dung>;

/*
// Another way to define a Schema
export const Nguoi_dungSchema = new mongoose.Schema({
  ho: String,
  ten: String,
});
*/

@Schema()
export class Nguoi_dung {
  @Prop()
  ho: string;

  @Prop()
  ten: string;
}

export const Nguoi_dungSchema = SchemaFactory.createForClass(Nguoi_dung);

