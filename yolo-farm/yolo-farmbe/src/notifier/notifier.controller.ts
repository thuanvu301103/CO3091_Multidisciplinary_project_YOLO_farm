import { Controller, Get, Post, Put, Param, Query, Res } from '@nestjs/common';
import { NotifierService } from './notifier.service';

@Controller('notifier')
export class NotifierController {
    constructor(private readonly notifierService: NotifierService) { }

    @Get('user/:userid/streamevent')
    async streamEvent(
        @Param('userid') userid: string,
        @Res() res
    ) {

        // Set up HTTP header for stream Event
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.flushHeaders();

        // each user that enter this url is provided these variable
        let threads = [null, null, null];
        let timecount_flag = [false, false, false];

        this.notifierService.mqtt_client.on('message', async (topic, message) => {

            let detail = await this.notifierService.evaluateVal(topic, message);

            // Handle the message as needed
            /* How Lazy u r Thuan Vu :))))*/
            let res_data = null;

            if (detail.feed_name == 'ma_feed_automatic') return;
            else if (detail.feed_name == 'ma_feed_nutnhan_den') return;
            else if (detail.feed_name == 'ma_feed_nutnhan_maybom') return;

            else res_data = await this.notifierService.updatePlantAreaChage(topic, detail.feed_name, message - 0, detail.evaluate);
            if (res_data['nguoi_dung_id'] != userid) return null;
            let content = null;
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
                        //return thread_num;
                        content = threads[thread_num];
                        res.write("data:" + JSON.stringify(content) + "\n\n");

                    }, 0.2 * 60 * 1000); // 2 minutes = 2 * 60 seconds * 1000 milliseconds
                }
                // else return null
                return null;
            }
            return null;
            
        });
    }

    // Get all notifies
    @Get('users/:userid/notifies')
    async getNotifies(
        @Param('userid') userid: string,
        @Query('page') page: number,
        @Query('limit') limit: number
    ) {
        return this.notifierService.getNotifies(userid, page, limit);
    }

    // Check a notify
    @Put('users/:userid/notifies/:notifyid/check/:checked')
    async checkNotify(
        @Param('notifyid') notifyid: string,
        @Param('checked') checked: string
    ) {
        this.notifierService.checkNotify(notifyid, checked);
    }




}

