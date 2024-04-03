import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type Ke_hoachDocument = HydratedDocument<Ke_hoach>;

@Schema()
export class Ke_hoach {
    @Prop()
    ten: string;

    @Prop()
    gioi_han_tren_anh_sang: number;

    @Prop()
    gioi_han_duoi_anh_sang: number;

    @Prop()
    gioi_han_tren_nhiet_do: number;

    @Prop()
    gioi_han_duoi_nhiet_do: number;

    @Prop()
    gioi_han_tren_do_am: number;

    @Prop()
    gioi_han_duoi_do_am: number;
 
}

export const Ke_hoachSchema = SchemaFactory.createForClass(Ke_hoach);

