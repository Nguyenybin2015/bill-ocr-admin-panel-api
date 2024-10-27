import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { cfg } from './config/env.config';

async function bootstrap() {
	const whitelist = cfg('WHITELIST')?.split(',') || ['*'];
	const corsConfig = whitelist.includes('*')
		? true
		: {
				origin: (
					origin: string,
					callback: (err: Error, callback: any) => void,
				) => {
					// bypass the requests with no origin (like curl requests, mobile apps, etc )
					if (!origin) return callback(null, true);
					if (whitelist.indexOf(origin) === -1) {
						const msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
						return callback(new Error(msg), false);
					}
					return callback(null, true);
				},
		  };
	const app = await NestFactory.create(AppModule, {
		cors: corsConfig,
	});
	app.use(helmet());
	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
	if (cfg('NODE_ENV') !== 'production') {
		const config = new DocumentBuilder()
			.setTitle(cfg('NAME'))
			.setVersion('3.0.0')
			.addBearerAuth()
			.addServer(cfg('APP_PUBLIC_ENDPOINT'))
			.addServer(cfg('APP_PUBLIC_ENDPOINT_DEV'))
			.addServer(cfg('APP_PUBLIC_ENDPOINT_STAGING'))
			.build();
		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup('/v1/docs', app, document);
	}

	await app.listen(cfg('APP_PORT', Number));
	console.log(`server run on: http://localhost:${cfg('APP_PORT')}`);
}
bootstrap();
