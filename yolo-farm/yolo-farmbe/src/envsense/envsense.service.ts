import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import * as adafenv from '../config/config.adafruitenv'
// Database Shemas
import { Nguoi_dung } from '../schemas/nguoi_dung.schema';
import { Khu_cay_trong } from '../schemas/khu_cay_trong.schema';
import { Ke_hoach } from '../schemas/ke_hoach.schema';
import { Tieu_chuan } from '../schemas/tieu_chuan.schema';

@Injectable()

export class EnvsenseService {
    
    private fe_url = "https://127.0.0.1:3001";

    private mqtt_client;

    /**
     * 
     * @param {...}Model: {...} database model
     */
    constructor(
        @InjectModel('Nguoi_dung') private readonly Nguoi_dungModel: Model<Nguoi_dung>,
        @InjectModel('Khu_cay_trong') private readonly Khu_cay_trongModel: Model<Khu_cay_trong>,
        @InjectModel('Ke_hoach') private readonly Ke_hoachModel: Model<Ke_hoach>,
        @InjectModel('Tieu_chuan') private readonly Tieu_chuanModel: Model<Tieu_chuan>
    ) {
  
        // Connect to Adafruit IO MQTT broker
        this.mqtt_client = mqtt.connect('mqtt://io.adafruit.com', {
            username: adafenv.username,
            password: adafenv.activekey
        });

        // Subscribe to your feed(s)
        this.mqtt_client.on('connect', async () => {
            
            let temp = await this.Khu_cay_trongModel.find({}, 'ma_feed_anh_sang ma_feed_nhiet_do').exec();
            for (let feeds of temp) {
                this.mqtt_client.subscribe(feeds.ma_feed_anh_sang);
                this.mqtt_client.subscribe(feeds.ma_feed_nhiet_do);  
            }
            console.log('Connected to Adafruit IO MQTT');
            
        });

        // Handle incoming messages
        this.mqtt_client.on('message', async (topic, message) => {

            let feeds = await this.Khu_cay_trongModel.find({ $or: [{ ma_feed_anh_sang: topic }, { ma_feed_nhiet_do: topic }] }, 'ke_hoach_id ma_feed_anh_sang ma_feed_nhiet_do').exec();
            let feed_name = null;
            let plan_id = null;
            // Identify feed_name of change
            for (let feed of feeds) {
                if (feed.ma_feed_anh_sang == topic) {
                    feed_name = "ma_feed_anh_sang";
                } else if (feed.ma_feed_nhiet_do == topic) {
                    feed_name = "ma_feed_nhiet_do";
                }
                plan_id = feed.ke_hoach_id;
            }
            // Identify limits of change
            let standards = await this.Tieu_chuanModel.find({ ke_hoach_id: plan_id }).exec();
            let currentDate = new Date();
            let evaluate = 0;
            for (let standard of standards) {
                
                let start_day = this.parseDayMonthString(standard.ngay_bat_dau.toString());
                let end_day = this.parseDayMonthString(standard.ngay_ket_thuc.toString());
                /*
                // Test
                console.log(standard.ngay_bat_dau.toString());
                console.log(standard.ngay_ket_thuc.toString());
                //console.log(this.isWithinRange(start_day, end_day, currentDate));
                console.log("Curent day:" + currentDate.toString());
                console.log("Start day:" + start_day.toString());
                console.log("End day:" + end_day.toString());
                */
                if (this.isWithinRange(start_day, end_day, currentDate)) {
                    // Get high and low level
                    let high_level = null;
                    let low_level = null;
                    if (feed_name == "ma_feed_anh_sang") {
                        high_level = standard.gioi_han_tren_anh_sang;
                        low_level = standard.gioi_han_duoi_anh_sang;

                    } else if (feed_name == "ma_feed_nhiet_do") {
                        high_level = standard.gioi_han_tren_nhiet_do;
                        low_level = standard.gioi_han_duoi_nhiet_do;
                    }
                    // Calculate evaluation value which the condition of values
                    if (message < low_level) evaluate = message - low_level;
                    else if (message > high_level) evaluate = message - high_level;
                }
            }

            console.log(`Received message on topic ${topic} - feed ${feed_name} - evaluation ${evaluate}: ${message.toString()}`);
            // Handle the message as needed
            this.sendFeedChangeToFe(this.fe_url, topic, feed_name, message-0, evaluate);
        });

        // Handle errors
        this.mqtt_client.on('error', (err) => {
            console.error('Adafruit IO MQTT error:', err);
        });
    }

    // Send updated data to fe server
    private async sendFeedChangeToFe(url: string, feed_key: string, feed: string, cur_val: number, eval_val: number): Promise<void> {
        try {
            let data = {
                feed_key: feed_key,
                feed: feed,
                curent_value: cur_val,
                evaluate: eval_val
            };
            console.log(data);
            let jsonData = JSON.stringify(data);
            const response = await axios.post(url, jsonData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Data sent successfully:');
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                console.error('Connection refused. The server is not reachable.');
                // Handle the error gracefully, e.g., log it or emit an event
            } else {
                console.error('Error sending data:', error);
                // Handle other types of errors as needed
            }
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
        // Test 
        //console.log("date compare: " + startDate > endDate);
        if (startDate > endDate) {
            if (currentDate <= startDate && currentDate >= endDate) return false;
            return true;
        }
        return (currentDate >= startDate) && (currentDate <= endDate);
    }

    // Get list of plant areas (khu_cay_trong) of one user
    // Promise<any[]> since result model is not defined
    public async getListPlantArea(owner_id: string): Promise<any[]> {
        return this.Khu_cay_trongModel.find({ nguoi_dung_id: owner_id }, '_id ma_feed_anh_sang ma_feed_nhiet_do ma_feed_do_am').exec();
    }
}
