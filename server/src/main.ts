import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { json, raw } from 'express';
import { AppModule } from './app.module';
import { IncomingMessage, ServerResponse } from 'http';
import * as dotenv from 'dotenv';
import { GlobalErrorFilter } from './filter/global-error.filter';
dotenv.config({ path: __dirname + '/../.env' });
// console.log('hola')
// console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
// console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY);
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: false,
  });
  const config = app.get(ConfigService);
  app.useGlobalFilters(new GlobalErrorFilter());

  // Behind a proxy/CDN (Cloudflare, Vercel, load balancer): trust forwarding
  // headers so req.ip and x-forwarded-for reflect the real client for geo-IP.
  app.set('trust proxy', true);

  app.use('/api/payments/webhook', raw({ type: 'application/json', verify: captureRawBody }));
  app.use(json({ limit: '20mb' }));

  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN') ?? 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const port = config.get<number>('PORT') ?? 4000;
  await app.listen(port);
}

function captureRawBody(
  req: IncomingMessage,
  res: ServerResponse,
  buf: Buffer,
  encoding: string
): void {
  // req.rawBody = buf;
  if (buf && buf.length) {
    // agregamos rawBody a la request
    (req as any).rawBody = buf.toString((encoding || 'utf8') as BufferEncoding);
  }
}

void bootstrap();
