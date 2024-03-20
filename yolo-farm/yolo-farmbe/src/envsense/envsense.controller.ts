import { Controller, Get } from '@nestjs/common';
import { EnvsenseService } from './envsense.service';

@Controller('envsense')
export class EnvsenseController {

    constructor(private readonly envsenseService: EnvsenseService) { }

    @Get('listen')
    async listenToFeed(): Promise<string> {
        // No need to do anything here since the service listens to messages internally
        return 'Listening to Adafruit feed...';
    }

    @Get()
    async print(): Promise<string> {
        return "Hello";
    }
}
