import { Module} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EnvsenseController } from './envsense.controller';
import { EnvsenseService } from './envsense.service';

@Module({
  imports: [HttpModule],
  controllers: [EnvsenseController],
  providers: [EnvsenseService]
})
export class EnvsenseModule {}
