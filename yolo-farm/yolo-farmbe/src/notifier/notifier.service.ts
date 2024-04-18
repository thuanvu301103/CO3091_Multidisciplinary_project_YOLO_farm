import { Injectable } from '@nestjs/common';
import { EnvsenseService } from '../envsense/envsense.service';
import { Canh_bao } from '../schemas/canh_bao.schema';
import { Nguoi_dung } from '../schemas/nguoi_dung.schema';
import { Khu_cay_trong } from '../schemas/khu_cay_trong.schema';
import { Ke_hoach } from '../schemas/ke_hoach.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class NotifierService {

    public mqtt_client = null;

    constructor(
        private readonly envsenseService: EnvsenseService,
        @InjectModel('Canh_bao') private readonly Canh_baoModel: Model<Canh_bao>,
        @InjectModel('Nguoi_dung') private readonly Nguoi_dungModel: Model<Nguoi_dung>,
        @InjectModel('Khu_cay_trong') private readonly Khu_cay_trongModel: Model<Khu_cay_trong>,
        @InjectModel('Ke_hoach') private readonly Ke_hoachModel: Model<Ke_hoach>
    ) {
        this.mqtt_client = envsenseService.getMqttConnection();

        this.mqtt_client.on('message', async (topic, message) => {

            let detail = await this.evaluateVal(topic, message);

            // Handle the message as needed
            
            let res_data = null;

            if (detail.feed_name == 'ma_feed_automatic') return;
            else if (detail.feed_name == 'ma_feed_nutnhan_den') return;
            else if (detail.feed_name == 'ma_feed_nutnhan_maybom') return;

            else res_data = await this.updatePlantAreaChage(topic, detail.feed_name, message - 0, detail.evaluate);
            
            // Save notifier to database
            let notify_data = {
                nguoi_dung_id: res_data['nguoi_dung_id'],
                khu_cay_trong_id: res_data['id'],
                time: new Date(),
                feed_type: detail.feed_name,
                evaluate: detail.evaluate,
                current_value: message - 0,
                checked: false
            };
            await this.Canh_baoModel.create(notify_data);
        });

    }

    public async evaluateVal(topic, message) {
        return this.envsenseService.evaluateVal(topic, message);
    }

    public async updatePlantAreaChage(topic, feed_name, curr_val, evaluate) {
        return this.envsenseService.updatePlantAreaChage(topic, feed_name, curr_val, evaluate);
    }

    public async getNotifies(user_id, page, limit) {
        const fetchNewestDocuments = async (pageNumber, limit) => {
            const pageSize = limit; // Number of documents per page
            const skipCount = (pageNumber - 1) * pageSize; // Calculate number of documents to skip

            try {
                // Fetch the newest documents sorted by createdAt in descending order (newest first)
                const documents = await this.Canh_baoModel.find()
                    .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
                    .skip(skipCount)
                    .limit(pageSize).exec();

                return documents;
            } catch (error) {
                console.error('Error fetching documents:', error);
                throw error;
            }
        };

        return await (await fetchNewestDocuments(page, limit)).reverse();
    }

    public async checkNotify(id, flag) {
        await this.Canh_baoModel.updateOne({ _id: id }, { $set: { checked: flag } }).exec()
    }
}
