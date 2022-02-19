import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Context } from 'aws-lambda';
import { createServer, proxy, Response } from 'aws-serverless-express';
import * as express from 'express';
import { Server } from 'http';
import { createApp } from './app';

let cachedServer: Server;
async function bootstrap(): Promise<Server> {
  const expressApp = express();
  const app = await createApp(expressApp);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Board API')
    .setDescription('The board API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.init();

  return createServer(expressApp);
}

export async function handler(event: any, context: Context): Promise<Response> {
  if (!cachedServer) {
    const server = await bootstrap();
    cachedServer = server;
  }
  return proxy(cachedServer, event, context, 'PROMISE').promise;
}
