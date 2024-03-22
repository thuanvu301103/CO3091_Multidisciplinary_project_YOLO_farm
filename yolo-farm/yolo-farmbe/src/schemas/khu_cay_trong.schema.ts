import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type Document = HydratedDocument<Khu_cay_trong>;

@Schema()
export class Khu_cay_trong {

  @Prop({ type: Types.ObjectId }) // Define type as ObjectId
  nguoi_dung_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId }) // Define type as ObjectId
  ke_hoach_id: Types.ObjectId;

  @Prop()
  ma_feed_anh_sang: string;

  @Prop()
  ma_feed_nhiet_do: string;

  @Prop()
  ma_feed_do_am: string;
}

export const Khu_cay_trongSchema = SchemaFactory.createForClass(Khu_cay_trong);

