import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type Tieu_chuanDocument = HydratedDocument<Tieu_chuan>;

@Schema()
export class Tieu_chuan {
  @Prop({ type: Types.ObjectId })
  ke_hoach_id: Types.ObjectId;

  @Prop()
  ngay_bat_dau: string;

  @Prop()
  ngay_ket_thuc: string;

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

export const Tieu_chuanSchema = SchemaFactory.createForClass(Tieu_chuan);

