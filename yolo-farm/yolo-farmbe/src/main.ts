import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Enable CORS with specific origin
  	app.enableCors({
    		origin: 'http://192.168.56.1:3001', // Allow requests from this origin
		// Other CORS options can be configured here
  	});

	await app.listen(3000);
}
bootstrap();
