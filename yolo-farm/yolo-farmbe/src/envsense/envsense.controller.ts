import { Controller, Get, Post, Param, Query, Res } from '@nestjs/common';
import { EnvsenseService } from './envsense.service';

@Controller('envsense')
export class EnvsenseController {

    constructor(private readonly envsenseService: EnvsenseService) { }

    @Get('user/:userid/streamevent')
    async streamEvent(
        @Param('userid') userid: string,
        @Res() res
    ) {
	    // Set up HTTP header for stream Event
	    res.setHeader('Content-Type', 'text/event-stream');
    	res.setHeader('Cache-Control', 'no-cache');
    	res.flushHeaders();
	
	    // Sent message when changes occurred	
	    this.envsenseService.mqtt_client.on('message', async (topic, message) => {

            let detail = await this.envsenseService.evaluateVal(topic, message);
            //console.log(detail);
            //console.log(`Received message on topic ${topic} - feed ${detail.feed_name} - evaluation ${detail.evaluate}: ${message.toString()}`);
            // Handle the message as needed
            let res_data = null;
            if (detail.feed_name == 'ma_feed_automatic') return;
            else if (detail.feed_name == 'ma_feed_nutnhan_den') res_data = await this.envsenseService.updateLightButtonChange(topic, detail.feed_name, message - 0);
            else if (detail.feed_name == 'ma_feed_nutnhan_maybom') res_data = await this.envsenseService.updateFanPumpButtonChange(topic, detail.feed_name, message - 0);
            else res_data = await this.envsenseService.updatePlantAreaChage(topic, detail.feed_name, message - 0, detail.evaluate);
            //console.log('Sent data: ', res_data['nguoi_dung_id']);
            //console.log('Sent data: ', userid);
            if (res_data['nguoi_dung_id'] == userid) {
                res.write("data:" + JSON.stringify(res_data) + "\n\n");
            }
        });
    }
    
    @Get('user/:id/plantarea/list')
    async getListPlantArea(@Param('id') id: string): Promise<any[]> {
        return this.envsenseService.getListPlantArea(id);
    }

    @Get('user/:userid/plantarea/:areaid')
    async getDetailPlantArea(@Param('userid') userid: string, @Param('areaid') areaid: string) {
        return this.envsenseService.getDetailPlantArea(userid, areaid);
    }

    @Get('user/:userid/plantarea/:areaid/history')
    async getHistoryData(
        @Query('filter') filter: string,
        @Query('start_time') start_time: string,
        @Query('end_time') end_time: string,
        @Param('userid') userid: string,
        @Param('areaid') areaid: string
    ) {
        if (filter == null) {
            let formatted_start_time = start_time + "T00:00Z";
            let formatted_end_time = end_time + "T23:59Z";
            return this.envsenseService.getHistoryData(formatted_start_time, formatted_end_time, userid, areaid);
        }
        let curr_date = new Date();
        // Extract the components of the date
        let year = curr_date.getFullYear();
        let month = curr_date.getMonth() + 1;
        let day = curr_date.getDate();
        let formatted_start_time = null;
        let formatted_end_time = null;

        // Construct the formatted string
        //const formatted_date = `${year}-${month}-${day}T${hours}:${minutes}`;
        if (filter == 'day') {
            let formatted_month = ('0' + month).slice(-2);
            let formatted_day = ('0' + day).slice(-2);
            formatted_start_time = `${year}-${formatted_month}-${formatted_day}T00:00Z`;
            formatted_end_time = `${year}-${formatted_month}-${formatted_day}T23:59Z`;
        }
        else if (filter == 'month') {
            let formatted_start_month = ('0' + month).slice(-2);
            let formatted_end_month = ('0' + (month + 1)).slice(-2);
            formatted_start_time = `${year}-${formatted_start_month}-01T00:00Z`;
            formatted_end_time = `${year}-${formatted_end_month}-01T00:00Z`;
        }
        else if (filter == 'year') {
            formatted_start_time = `${year}-01-01T00:00Z`;
            formatted_end_time = `${year+1}-12-31T23:59Z`;
        }
        return this.envsenseService.getHistoryData(formatted_start_time, formatted_end_time, userid, areaid);
    }

    @Get('user/:userid/plantarea/:areaid/automatic/turnon/:turnon')
    async changeAutomaticMode(
        @Param('userid') userid: string,
        @Param('areaid') areaid: string,
        @Param('turnon') turnon: number
    ) {
        let result = await this.envsenseService.changeAutomaticMode(userid, areaid, turnon);
        return result;
    }

    /**
     * Get Current Button State
     */

    // Get automatic mode state
    @Get('user/:userid/plantarea/:areaid/automatic')
    async getCurrAutomaticMode(
        @Param('userid') userid: string,
        @Param('areaid') areaid: string
    ) {
        let result = await this.envsenseService.getCurrAutomaticMode(userid, areaid);
        //console.log('Automatic mode JSON: ', result);
        return result;
    }

    // Get light relay state
    @Get('user/:userid/plantarea/:areaid/light/state')
    async getCurrLightState(
        @Param('userid') userid: string,
        @Param('areaid') areaid: string
    ) {
        let result = await this.envsenseService.getCurrLightState(userid, areaid);
        //console.log('Automatic mode JSON: ', result);
        return result;
    }

    // Get fan + pump state
    @Get('user/:userid/plantarea/:areaid/fanpump/state')
    async getCurrFanPumpState(
        @Param('userid') userid: string,
        @Param('areaid') areaid: string
    ) {
        let result = await this.envsenseService.getCurrFanPumpState(userid, areaid);
        //console.log('Automatic mode JSON: ', result);
        return result;
    }

    /**
    * Get Current Mode
    */

    // Get Curent Light Mode
    @Get('user/:userid/plantarea/:areaid/light/getmode')
    async getLightMode(
        @Param('userid') userid: string,
        @Param('areaid') areaid: string
    ) {
        let result = await this.envsenseService.getLightMode(userid, areaid);
        //console.log("Light Mode Result: ", result);
        return result;
    }

    // Get Curent Fan + Pump Mode
    @Get('user/:userid/plantarea/:areaid/fanpump/getmode')
    async getFanPumpMode(
        @Param('userid') userid: string,
        @Param('areaid') areaid: string
    ) {
        let result = await this.envsenseService.getFanPumpMode(userid, areaid);
        return result;
    }

    /**
    * Change Current Mode
    */

    @Get('user/:userid/plantarea/:areaid/light/mode/:mode')
    async changeLightMode(
        @Param('userid') userid: string,
        @Param('areaid') areaid: string,
        @Param('mode') mode: string,
        @Res() res
    ) {
        let result: Promise<string> = this.envsenseService.changeLightMode(userid, areaid, mode);
        if (await result == "400") res.status(400).send("Bad Request");
        else if (await result == "200") res.status(200).send("OK");
        else if (await result == "500") res.status(500).send("Internal Server Error");
    }

    @Get('user/:userid/plantarea/:areaid/fanpump/mode/:mode')
    async changeFanPumpMode(
        @Param('userid') userid: string,
        @Param('areaid') areaid: string,
        @Param('mode') mode: string,
        @Res() res
    ) {
        let result: Promise<string> = this.envsenseService.changeFanPumpMode(userid, areaid, mode);
        if (await result == "400") res.status(400).send("Bad Request");
        else if (await result == "200") res.status(200).send("OK");
        else if (await result == "500") res.status(500).send("Internal Server Error");
    }

    /*
     * Ex: http://127.0.0.1:3000/envsense/user/65f0529c5933e074166715a5/plantarea/65f0529c5933e074166715a8/light/turnon/1
     */
    @Get('user/:userid/plantarea/:areaid/light/turnon/:turnon')
    async turnOnLight(
        @Param('userid') userid: string,
        @Param('areaid') areaid: string,
        @Param('turnon') turnon: number,
        @Res() res
    ) {
	    //console.log("Working...");
        let result = await this.envsenseService.turnOnLight(userid, areaid, turnon);
        if (result) res.status(200).send('OK');
        else res.status(403).send('Forbidden: manual mode is off');
    }

    @Get('user/:userid/plantarea/:areaid/fanpump/turnon/:turnon')
    async turnOnFanPump(
        @Param('userid') userid: string,
        @Param('areaid') areaid: string,
        @Param('turnon') turnon: number,
        @Res() res
    ) {
        //console.log("Working...");
        let result = await this.envsenseService.turnOnFanPump(userid, areaid, turnon);
        if (result) res.status(200).send('OK');
        else res.status(403).send('Forbidden: manual mode is off');
    }
}
