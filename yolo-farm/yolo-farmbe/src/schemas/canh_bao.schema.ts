import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';

export type Document = HydratedDocument<Canh_bao>;

@Schema()
export class Canh_bao {

    @Prop({ type: Types.ObjectId }) // Define type as ObjectId
    nguoi_dung_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId }) // Define type as ObjectId
    khu_cay_trong_id: Types.ObjectId;

    @Prop({ type: Date, default: Date.now })
    time: Date;

    @Prop()
    feed_type: string;

    @Prop()
    evaluate: number;

    @Prop()
    current_value: number;

    @Prop()
    checked: boolean;
}

export const Canh_baoSchema = SchemaFactory.createForClass(Canh_bao);

