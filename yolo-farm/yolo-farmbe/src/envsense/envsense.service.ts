import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import * as adafenv from '../config/config.adafruit'
// Database Shemas
import { Nguoi_dung } from '../schemas/nguoi_dung.schema';
import { Khu_cay_trong } from '../schemas/khu_cay_trong.schema';
import { Ke_hoach } from '../schemas/ke_hoach.schema';

@Injectable()

export class EnvsenseService {

    public mqtt_client;

    /**
     * 
     * @param {...}Model: {...} database model
     */
    constructor(
        @InjectModel('Nguoi_dung') private readonly Nguoi_dungModel: Model<Nguoi_dung>,
        @InjectModel('Khu_cay_trong') private readonly Khu_cay_trongModel: Model<Khu_cay_trong>,
        @InjectModel('Ke_hoach') private readonly Ke_hoachModel: Model<Ke_hoach>    ) {

        // Connect to Adafruit IO MQTT broker
        this.mqtt_client = mqtt.connect('mqtt://io.adafruit.com', {
            username: adafenv.username,
            password: adafenv.activekey
        });

        // Subscribe to your feed(s)
        this.mqtt_client.on('connect', async () => {

            let temp = await this.Khu_cay_trongModel.find({}).exec();
            for (let feeds of temp) {
                this.mqtt_client.subscribe(feeds.ma_feed_anh_sang);
                this.mqtt_client.subscribe(feeds.ma_feed_nhiet_do);
                this.mqtt_client.subscribe(feeds.ma_feed_do_am);
                this.mqtt_client.subscribe(feeds.ma_feed_nutnhan_den);
                this.mqtt_client.subscribe(feeds.ma_feed_nutnhan_maybom);
                this.mqtt_client.subscribe(feeds.ma_feed_automatic);
            }
            console.log('Connected to Adafruit IO MQTT');

        });

        // Handle incoming messages
	    /* ... */
       
        // Handle errors
        this.mqtt_client.on('error', (err) => {
            console.error('Adafruit IO MQTT error:', err);
        });
    }

    // Get mqtt connection
    public getMqttConnection() {
        return this.mqtt_client;
    }

    // Send updated data to fe server
    public async updatePlantAreaChage(feed_name: string, feed_type: string, curr_val: number, eval_val: number) {
        try {
            let area = await this.Khu_cay_trongModel.findOne({ $or: [{ ma_feed_anh_sang: feed_name }, { ma_feed_do_am: feed_name }, { ma_feed_nhiet_do: feed_name }] }).exec();
            let user_id = area.nguoi_dung_id;
            let plan_id = area.ke_hoach_id;
            /*
            let ma_feed_anh_sang = area.ma_feed_anh_sang;
            let ma_feed_nhiet_do = area.ma_feed_nhiet_do;
            let ma_feed_do_am = area.ma_feed_do_am;
            */
            let plan = await this.Ke_hoachModel.findOne({ _id: plan_id }).exec();
            let high_warning = null;
            let low_warning = null;
            if (feed_type === 'ma_feed_anh_sang') {
                high_warning = plan.gioi_han_tren_anh_sang;
                low_warning = plan.gioi_han_duoi_anh_sang;
            } else if (feed_type === 'ma_feed_nhiet_do') {
                high_warning = plan.gioi_han_tren_nhiet_do;
                low_warning = plan.gioi_han_duoi_nhiet_do;
            } else if (feed_type === 'ma_feed_do_am') {
                high_warning = plan.gioi_han_tren_do_am;
                low_warning = plan.gioi_han_duoi_do_am;
            }

            return {
                id: area._id,
                nguoi_dung_id: user_id,
                feed_type: feed_type,
                curent_value: curr_val,
                evaluate: eval_val,
                high_warning: high_warning,
                low_warning: low_warning
            }
        } catch (error) {
            return null;
        }
    }

    // Parse start and end day-month strings into Date objects
    private parseDayMonthString(dayMonthString): Date {
        const [day, month] = dayMonthString.split('-').map(Number);
        /*
        // Test
        console.log([day, month]);
        console.log(dayMonthString);
        */
        return new Date(new Date().getFullYear(), month - 1, day); // Subtracting 1 from month to adjust (months are zero-based)
    }

    // Check if current date falls within the range
    private isWithinRange(startDate, endDate, currentDate): boolean {
        /*
        // Test
        console.log("date compare: " + startDate > endDate);
        */
        if (startDate > endDate) {
            if (currentDate <= startDate && currentDate >= endDate) return false;
            return true;
        }
        return (currentDate >= startDate) && (currentDate <= endDate);
    }

    // Evaluate curent value
    public async evaluateVal(topic, message): Promise<{ feed_name: string; evaluate: number; }> {
        try {
            let area = await this.Khu_cay_trongModel.findOne({ $or: [{ ma_feed_anh_sang: topic }, { ma_feed_nhiet_do: topic }, { ma_feed_do_am: topic }, { ma_feed_nutnhan_den: topic }, { ma_feed_nutnhan_maybom: topic }, { ma_feed_automatic: topic }] }).exec();
            let feed_name = null;
            let plan_id = null;

            // Identify feed_name of change
            if (area.ma_feed_anh_sang === topic) {
                feed_name = "ma_feed_anh_sang";
            } else if (area.ma_feed_nhiet_do === topic) {
                feed_name = "ma_feed_nhiet_do";
            } else if (area.ma_feed_do_am === topic) {
                feed_name = "ma_feed_do_am";
            } else if (area.ma_feed_nutnhan_den == topic) {
                feed_name = "ma_feed_nutnhan_den";
                return { "feed_name": feed_name, "evaluate": 0 };
            } else if (area.ma_feed_nutnhan_maybom == topic) {
                feed_name = "ma_feed_nutnhan_maybom";
                return { "feed_name": feed_name, "evaluate": 0 };
            } else if (area.ma_feed_automatic == topic) {
                feed_name = "ma_feed_automatic";
                return { "feed_name": feed_name, "evaluate": 0 };
            }
            plan_id = area.ke_hoach_id;

            // Identify limits of change
            let standard = await this.Ke_hoachModel.findOne({ _id: plan_id }).exec();
            let high_level = null;
            let low_level = null;
            if (feed_name == "ma_feed_anh_sang") {
                high_level = standard.gioi_han_tren_anh_sang;
                low_level = standard.gioi_han_duoi_anh_sang;
            } else if (feed_name == "ma_feed_nhiet_do") {
                high_level = standard.gioi_han_tren_nhiet_do;
                low_level = standard.gioi_han_duoi_nhiet_do;
            } else if (feed_name == "ma_feed_do_am") {
                high_level = standard.gioi_han_tren_do_am;
                low_level = standard.gioi_han_duoi_do_am;
            }

            let evaluate = 0;
            // Calculate evaluation value which the condition of values
            if (message < low_level) evaluate = message - low_level;
            else if (message > high_level) evaluate = message - high_level;
            return { "feed_name": feed_name, "evaluate": evaluate };
        } catch (error) {
            console.error('Error sending data to Adafruit:', error);
            return { "feed_name": '', "evaluate": 0 };
            // Handle error here
        }
    }

    // Get list of plant areas (khu_cay_trong) of one user
    // Promise<any[]> since result model is not defined
    public async getListPlantArea(owner_id: string): Promise<any[]> {
        return this.Khu_cay_trongModel.find({ nguoi_dung_id: owner_id }, '_id ten ma_feed_anh_sang ma_feed_nhiet_do ma_feed_do_am').exec();
    }

    // Get detail of plant areas (khu_cay_trong) of one user
    // Promise<any[]> since result model is not defined
    public async getDetailPlantArea(userid: string, areaid: string) {
        let area = await this.Khu_cay_trongModel.findOne({ $and: [{ nguoi_dung_id: userid }, { _id: areaid }] }).exec(); 
        let user_id = area.nguoi_dung_id;
        let plan_id = area.ke_hoach_id;
        let ma_feed_anh_sang = area.ma_feed_anh_sang;
        let ma_feed_nhiet_do = area.ma_feed_nhiet_do;
	    let ma_feed_do_am = area.ma_feed_do_am;
        let plan = await this.Ke_hoachModel.findOne({ _id: plan_id }).exec();
        let plan_name = plan.ten;

        // Get latest values
        let curr_anh_sang = null;
        let curr_nhiet_do = null;
	    let curr_do_am = null;
        
        await axios.get(`https://io.adafruit.com/api/v2/${ma_feed_anh_sang}/data?limit=1`)
            .then(response => {
                //console.log('Response:', response.data[0].value);
                curr_anh_sang = response.data[0].value;
            });
        let eval_anh_sang = (await this.evaluateVal(ma_feed_anh_sang, curr_anh_sang)).evaluate;

        await axios.get(`https://io.adafruit.com/api/v2/${ma_feed_nhiet_do}/data?limit=1`)
            .then(response => {
                //console.log('Response:', response.data[0].value);
                curr_nhiet_do = response.data[0].value;
            });
        let eval_nhiet_do = (await this.evaluateVal(ma_feed_nhiet_do, curr_nhiet_do)).evaluate;

        await axios.get(`https://io.adafruit.com/api/v2/${ma_feed_do_am}/data?limit=1`)
            .then(response => {
                //console.log('Response:', response.data[0].value);
                curr_do_am = response.data[0].value;
            });
        let eval_do_am = (await this.evaluateVal(ma_feed_do_am, curr_do_am)).evaluate;

        return {
            id: area._id,
            ten_khu_cay_trong: area.ten,
            nguoi_dung_id: user_id,
            ten_ke_hoach: plan_name,
            anh_sang: {
                curent_value: curr_anh_sang,
                evaluate: eval_anh_sang,
                high_warning: plan.gioi_han_tren_anh_sang,
                low_warning: plan.gioi_han_duoi_anh_sang
            },
            nhiet_do: {
                curent_value: curr_nhiet_do,
                evaluate: eval_nhiet_do,
                high_warning: plan.gioi_han_tren_nhiet_do,
                low_warning: plan.gioi_han_duoi_nhiet_do
            },
            do_am: {
                curent_value: curr_do_am,
                evaluate: eval_do_am,
                high_warning: plan.gioi_han_tren_do_am,
                low_warning: plan.gioi_han_duoi_do_am
            }
        }
    }
	 
    // Get history chart data
    public async getHistoryData(start_time: string, end_time: string, userid: string, areaid: string) {
        let feeds = await this.Khu_cay_trongModel.findOne({ $and: [{ nguoi_dung_id: userid }, { _id: areaid}]}, 'ma_feed_anh_sang ma_feed_nhiet_do ma_feed_do_am').exec()
        let anh_sang_data = null;
        let nhiet_do_data = null;
        let do_am_data = null;
        await axios.get(`https://io.adafruit.com/api/v2/${feeds.ma_feed_anh_sang}/data/chart?start_time=${start_time}&end_time=${end_time}`)
            .then(response => {
                anh_sang_data = response.data.data;
            });
        await axios.get(`https://io.adafruit.com/api/v2/${feeds.ma_feed_nhiet_do}/data/chart?start_time=${start_time}&end_time=${end_time}`)
            .then(response => {
                nhiet_do_data = response.data.data;
            });
        await axios.get(`https://io.adafruit.com/api/v2/${feeds.ma_feed_do_am}/data/chart?start_time=${start_time}&end_time=${end_time}`)
            .then(response => {
                do_am_data = response.data.data;
            });
        return {
            anh_sang_chart_data: anh_sang_data,
            nhiet_do_chart_data: nhiet_do_data,
            do_am_chart_data: do_am_data
        }
    }

    /** Automatic 
     */
    // Change Automatic mode
    public async changeAutomaticMode(userid: string, areaid: string, turnon: number) {
        try {
            let area = await this.Khu_cay_trongModel.findOne({ $and: [{ nguoi_dung_id: userid }, { _id: areaid }] }).exec()
            //console.log(area.ma_feed_automatic);
            // send upadate message
            const response = await axios.post(`https://io.adafruit.com/api/v2/${area.ma_feed_automatic}/data`, {
                value: turnon
            }, {
                headers: {
                    'X-AIO-Key': adafenv.activekey
                }
            });
            console.log(response.data); // Handle response data here

            if (turnon == 1)
                await this.Khu_cay_trongModel.updateOne({ $and: [{ nguoi_dung_id: userid }, { _id: areaid }] }, { $set: { che_do_tu_dong: true } }).exec();
            else
                await this.Khu_cay_trongModel.updateOne({ $and: [{ nguoi_dung_id: userid }, { _id: areaid }] }, { $set: { che_do_tu_dong: false } }).exec();

            return true;
        } catch (error) {
            console.error('Error sending data to Adafruit:', error);
            return false;
            // Handle error here
        }
    }

    // Get curent Automatic mode
    public async getCurrAutomaticMode(userid: string, areaid: string) {
        try {
            let area = await this.Khu_cay_trongModel.findOne({ $and: [{ nguoi_dung_id: userid }, { _id: areaid }] }).exec()
            // send upadate message
            const response = await axios.get(`https://io.adafruit.com/api/v2/${area.ma_feed_automatic}/data?limit=1`);
            // console.log(response.data); // Handle response data here
            let result = response.data[0].value;
            console.log('Automatic mode: ', result );
            return result;
        } catch (error) {
            console.error('Error sending data to Adafruit:', error);
            return 0;
            // Handle error here
        }
    }

    // Get curent Light State
    public async getCurrLightState(userid: string, areaid: string) {
        try {
            let area = await this.Khu_cay_trongModel.findOne({ $and: [{ nguoi_dung_id: userid }, { _id: areaid }] }).exec()
            // send upadate message
            const response = await axios.get(`https://io.adafruit.com/api/v2/${area.ma_feed_nutnhan_den}/data?limit=1`);
            // console.log(response.data); // Handle response data here
            let result = response.data[0].value;
            console.log('LightRelay state: ', result);
            return result;
        } catch (error) {
            console.error('Error sending data to Adafruit:', error);
            return 0;
            // Handle error here
        }
    }

    // Get curent Light State
    public async getCurrFanPumpState(userid: string, areaid: string) {
        try {
            let area = await this.Khu_cay_trongModel.findOne({ $and: [{ nguoi_dung_id: userid }, { _id: areaid }] }).exec()
            // send upadate message
            const response = await axios.get(`https://io.adafruit.com/api/v2/${area.ma_feed_nutnhan_maybom}/data?limit=1`);
            // console.log(response.data); // Handle response data here
            let result = response.data[0].value;
            console.log('Fan + Pump state: ', result);
            return result;
        } catch (error) {
            console.error('Error sending data to Adafruit:', error);
            return 0;
            // Handle error here
        }
    }

    /**Light sensor module
     */

    // Turn on or of light
    public async turnOnLight(userid: string, areaid: string, turnon: number) {
        try {
            let area = await this.Khu_cay_trongModel.findOne({ $and: [{ nguoi_dung_id: userid }, { _id: areaid }] }, 'ma_feed_anh_sang ma_feed_nutnhan_den che_do_anh_sang').exec()
            console.log(area.che_do_anh_sang);
            if (area.che_do_anh_sang != "thu cong") return false;
           
            // send upadate message
            const response = await axios.post(`https://io.adafruit.com/api/v2/${area.ma_feed_nutnhan_den}/data`, {
                value: turnon
            }, {
                headers: {
                    'X-AIO-Key': adafenv.activekey
                }
            });
            console.log(response.data); // Handle response data here
            return true;
        } catch (error) {
            console.error('Error sending data to Adafruit:', error);
            return false;
            // Handle error here
        }
    }

    // Get light mode
    public async getLightMode(userid: string, areaid: string) {
        try {
            let area = await this.Khu_cay_trongModel.findOne({ $and: [{ nguoi_dung_id: userid }, { _id: areaid }] }).exec()
            //console.log("Light Mode: ", area['che_do_anh_sang']);
            return area['che_do_anh_sang'];
        } catch (error) {
            console.error('Error sending data to Adafruit:', error);
            return 0;
            // Handle error here
        }
    }

    // Change light mode
    public async changeLightMode(userid: string, areaid: string, mode: string) {
        try {
            let valid_modes = ["tu dong", "thu cong", "theo lich"];
            if (!(valid_modes.includes(mode))) return "400";

            await this.Khu_cay_trongModel.updateOne({ $and: [{ nguoi_dung_id: userid }, { _id: areaid }] }, { $set: {che_do_anh_sang: mode}}).exec()

            return "200";
        } catch (error) {
            console.error('Error sending data to Adafruit:', error);
            return "500";
            // Handle error here
        }
    }

    // Update Light button's change
    public async updateLightButtonChange(feed_name: string, feed_type: string, curr_val: number) {
        let area = await this.Khu_cay_trongModel.findOne({ ma_feed_nutnhan_den: feed_name}).exec();
        let user_id = area.nguoi_dung_id;
        
        return {
            id: area._id,
            nguoi_dung_id: user_id,
            feed_type: feed_type,
            curent_value: curr_val
        }
    }

    /**Temp + Humid sensor module
     */

    // Turn on or of fanpump
    public async turnOnFanPump(userid: string, areaid: string, turnon: number) {
        try {
            let area = await this.Khu_cay_trongModel.findOne({ $and: [{ nguoi_dung_id: userid }, { _id: areaid }] }).exec()
            //console.log(area.che_do_anh_sang);
            if (area.che_do_nhiet_am != "thu cong") return false;

            // send upadate message
            const response = await axios.post(`https://io.adafruit.com/api/v2/${area.ma_feed_nutnhan_maybom}/data`, {
                value: turnon
            }, {
                headers: {
                    'X-AIO-Key': adafenv.activekey
                }
            });
            console.log(response.data); // Handle response data here
            return true;
        } catch (error) {
            console.error('Error sending data to Adafruit:', error);
            return false;
            // Handle error here
        }
    }

    // Get fan + pump mode
    public async getFanPumpMode(userid: string, areaid: string) {
        try {
            let area = await this.Khu_cay_trongModel.findOne({ $and: [{ nguoi_dung_id: userid }, { _id: areaid }] }).exec()
            //console.log("Light Mode: ", area['che_do_anh_sang']);
            return area['che_do_nhiet_am'];
        } catch (error) {
            console.error('Error sending data to Adafruit:', error);
            return 0;
            // Handle error here
        }
    }

    // Change fan + pump mode
    public async changeFanPumpMode(userid: string, areaid: string, mode: string) {
        try {
            let valid_modes = ["tu dong", "thu cong", "theo lich"];
            if (!(valid_modes.includes(mode))) return "400";

            await this.Khu_cay_trongModel.updateOne({ $and: [{ nguoi_dung_id: userid }, { _id: areaid }] }, { $set: { che_do_nhiet_am: mode } }).exec()

            return "200";
        } catch (error) {
            console.error('Error sending data to Adafruit:', error);
            return "500";
            // Handle error here
        }
    }

    // Update fan + pump button's change
    public async updateFanPumpButtonChange(feed_name: string, feed_type: string, curr_val: number) {
        let area = await this.Khu_cay_trongModel.findOne({ ma_feed_nutnhan_maybom: feed_name }).exec();
        let user_id = area.nguoi_dung_id;

        return {
            id: area._id,
            nguoi_dung_id: user_id,
            feed_type: feed_type,
            curent_value: curr_val
        }
    }
}