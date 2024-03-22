import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type Ke_hoachDocument = HydratedDocument<Ke_hoach>;

@Schema()
export class Ke_hoach {
  @Prop()
  ten: string;
}

export const Ke_hoachSchema = SchemaFactory.createForClass(Ke_hoach);

