import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { backendDBManager } from './dependency-injection';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser'
async function bootstrap() {
  dotenv.config();
  await backendDBManager.connect();

  const app = await NestFactory.create(AppModule);
  const globalPrefix = '/';
  app.setGlobalPrefix(globalPrefix);

  const corsOptions: CorsOptions = {
    origin: '*', // o especifica la URL del cliente permitida en lugar de '*'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type, Accept, Authorization', // Encabezados permitidos
    credentials: true // Habilita el envío de credenciales (cookies, tokens de autenticación, etc.)
  };

  app.enableCors(corsOptions);
  const port = process.env.PORT || 3001;
  app.use(bodyParser.json({ limit: '20mb' }))
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }))
  await app.listen(port);
  Logger.log(`🚀 Application is running on port: ${port}${globalPrefix}`);
}

bootstrap();