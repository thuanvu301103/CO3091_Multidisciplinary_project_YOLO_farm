import { Controller, Get, Param } from '@nestjs/common';
import { EnvsenseService } from './envsense.service';

@Controller('envsense')
export class EnvsenseController {

    constructor(private readonly envsenseService: EnvsenseService) { }
    
    @Get('user/:id/plantarea/list')
    async getListPlantArea(@Param('id') id: string): Promise<any[]> {
        return this.envsenseService.getListPlantArea(id);
    }

    @Get('user/:userid/plantarea/:areaid')
    async getDetailPlantArea(@Param('userid') userid: string, @Param('areaid') areaid: string) {
        return this.envsenseService.getDetailPlantArea(userid, areaid);
    }
}
