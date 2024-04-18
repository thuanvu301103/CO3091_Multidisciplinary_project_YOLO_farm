import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

import { Nguoi_dungSchema } from '../schemas/nguoi_dung.schema';

@Module({
	imports: [
		HttpModule,
		MongooseModule.forFeature([
			{ name: 'Nguoi_dung', schema: Nguoi_dungSchema }
		])
	],
	controllers: [LoginController],
	providers: [LoginService],
})
export class LoginModule {}
