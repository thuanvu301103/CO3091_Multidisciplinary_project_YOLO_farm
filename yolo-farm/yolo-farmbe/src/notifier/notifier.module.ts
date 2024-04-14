import { Module } from '@nestjs/common';
import { NotifierService } from './notifier.service';
import { NotifierController } from './notifier.controller';
import { EnvsenseModule } from '../envsense/envsense.module';

@Module({
    imports: [EnvsenseModule],
    providers: [NotifierService],
    controllers: [NotifierController]
})
export class NotifierModule {}
