import { Module} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvsenseController } from './envsense.controller';
import { EnvsenseService } from './envsense.service';
// Database Schema import
import { Nguoi_dungSchema } from '../schemas/nguoi_dung.schema';
import { Khu_cay_trongSchema } from '../schemas/khu_cay_trong.schema';
import { Ke_hoachSchema } from '../schemas/ke_hoach.schema';
import { Tieu_chuanSchema } from '../schemas/tieu_chuan.schema';

@Module({
	imports: [
		HttpModule,
		MongooseModule.forFeature([
			{ name: 'Nguoi_dung', schema: Nguoi_dungSchema },
			{ name: 'Khu_cay_trong', schema: Khu_cay_trongSchema },
			{ name: 'Ke_hoach', schema: Ke_hoachSchema },
			{ name: 'Tieu_chuan', schema: Tieu_chuanSchema }
		])
	],
	controllers: [EnvsenseController],
	providers: [EnvsenseService]
})
export class EnvsenseModule {}
