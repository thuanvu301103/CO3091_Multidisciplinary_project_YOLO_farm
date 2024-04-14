import { Injectable } from '@nestjs/common';
import { EnvsenseService } from '../envsense/envsense.service';


@Injectable()
export class NotifierService {

    public mqtt_client = null;

    constructor(private readonly envsenseService: EnvsenseService) {
        this.mqtt_client = envsenseService.getMqttConnection();

    }

    public async evaluateVal(topic, message) {
        return this.envsenseService.evaluateVal(topic, message);
    }

    public async updatePlantAreaChage(topic, feed_name, curr_val, evaluate) {
        return this.envsenseService.updatePlantAreaChage(topic, feed_name, curr_val, evaluate);
    }

    public async catchdata(res_data, threads, timecount_flag, time) {

        if (res_data['evaluate'] != 0) {
            // If the flag is not on then set flag
            let thread_num = 0;
            if (res_data['feed_type'] == 'ma_feed_nhiet_do') thread_num = 1;
            else if (res_data['feed_type'] == 'ma_feed_do_am') thread_num = 2;
            // Change the thread content 
            threads[thread_num] = res_data;
            if (timecount_flag[thread_num] == false) {
                timecount_flag[thread_num] = true;
                // Set time count
                setTimeout(() => {
                    // After 2 minutes, check the condition again
                    console.log('Checking condition again after waiting...');
                    if (threads[thread_num]['evaluate'] == 0) { return null; }
                    
                    console.log("After 2 minutes: ", timecount_flag[thread_num]);
                    console.log("After 2 minutes: ", threads[thread_num]);
                    timecount_flag[thread_num] = false;
                    //return threads[thread_num];
                    return thread_num;
                }, time * 60 * 1000); // 2 minutes = 2 * 60 seconds * 1000 milliseconds
            }
            // else return null
            return null;
        }
        return null;

    }



}
