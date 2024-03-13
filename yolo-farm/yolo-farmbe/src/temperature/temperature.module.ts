import { Module } from '@nestjs/common';
import { TemperatureController } from './temperature.controller';
import { TemperatureService } from './temperature.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: "User", schema: UserSchema }])],
  controllers: [TemperatureController],
  providers: [TemperatureService]
})
export class TemperatureModule {}
