import { Module } from '@nestjs/common';
import { NotifierService } from './notifier.service';
import { NotifierController } from './notifier.controller';
import { EnvsenseModule } from '../envsense/envsense.module';
import { Canh_baoSchema } from '../schemas/canh_bao.schema';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Nguoi_dungSchema } from '../schemas/nguoi_dung.schema';
import { Khu_cay_trongSchema } from '../schemas/khu_cay_trong.schema';
import { Ke_hoachSchema } from '../schemas/ke_hoach.schema';

@Module({
    imports: [
        EnvsenseModule,
        HttpModule,
        MongooseModule.forFeature([
            { name: 'Canh_bao', schema: Canh_baoSchema },
            { name: 'Nguoi_dung', schema: Nguoi_dungSchema },
            { name: 'Khu_cay_trong', schema: Khu_cay_trongSchema },
            { name: 'Ke_hoach', schema: Ke_hoachSchema }
        ]),
    ],
    providers: [NotifierService],
    controllers: [NotifierController]
})
export class NotifierModule {}
