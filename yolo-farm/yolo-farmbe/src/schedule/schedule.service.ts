import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScheduleService {
    private cronExpression: string = null;
    public light_schedule_mode: string = "day";

    constructor() {
        // Read the cron expression from the database

        // this.cronExpression = fs.readFileSync('schedule.txt', 'utf8').trim();
    }
    /*
    // Schedule the task using the cron expression read from the file
    @Cron(cronExpression)
    handleCron() {
        // Perform the task logic here
        console.log('Scheduled task started using cron from file.');
    }
    */
}
