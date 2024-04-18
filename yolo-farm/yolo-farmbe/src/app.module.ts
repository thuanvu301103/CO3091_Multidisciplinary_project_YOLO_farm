import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvsenseModule } from './envsense/envsense.module';
import { NotifierModule } from './notifier/notifier.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/yolo-farm'), EnvsenseModule, NotifierModule, LoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
