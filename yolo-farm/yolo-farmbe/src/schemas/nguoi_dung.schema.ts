import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type Nguoi_dungDocument = HydratedDocument<Nguoi_dung>;

@Schema()
export class Nguoi_dung {
    @Prop()
    ho: string;

    @Prop()
    ten: string;

    @Prop()
    username: string;

    @Prop()
    password: string;

    @Prop()
    role: string;
}

export const Nguoi_dungSchema = SchemaFactory.createForClass(Nguoi_dung);

