import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { EnvsenseService } from './envsense.service';

@Controller('envsense')
export class EnvsenseController {

    constructor(private readonly envsenseService: EnvsenseService) { }

	@Get()
	async streamEvent(@Res() res) {
	// Set up HTTP header for stream Event
	res.setHeader('Content-Type', 'text/event-stream');
    	res.setHeader('Cache-Control', 'no-cache');
    	res.flushHeaders();
	
		// Sent message when changes occurred	
		this.envsenseService.mqtt_client.on('message', async (topic, message) => {

            let detail = await this.envsenseService.evaluateVal(topic, message);
            console.log(detail);

            console.log(`Received message on topic ${topic} - feed ${detail.feed_name} - evaluation ${detail.evaluate}: ${message.toString()}`);
            // Handle the message as needed
            let res_data = JSON.stringify(await this.envsenseService.updatePlantAreaChage(topic, detail.feed_name, message - 0, detail.evaluate));
			console.log('Sent data: ', res_data);
            res.write("data:" + res_data + "\n\n");
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
        //const month = ('0' + (curr_date.getMonth() + 1)).slice(-2); // Adding 1 to month because it's zero-based
        //const day = ('0' + curr_date.getDate()).slice(-2);

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
}
