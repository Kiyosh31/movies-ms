import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { GlobalRpcExceptionFilter } from './exceptions/rpc.exception';
import { ValidationPipe } from '@nestjs/common';

const serviceName = 'Gateway';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');

  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new GlobalRpcExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(port);
  console.log(`[Service ${serviceName}] running on port: ${port}`);
}

bootstrap().catch((err) => {
  console.error(`Failed to start ${serviceName} service:`, err);
  process.exit(1);
});
