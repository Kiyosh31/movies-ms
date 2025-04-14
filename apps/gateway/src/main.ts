import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import { GrpcExceptionFilter } from './exceptions/grpc.exception';
import { Logger } from 'nestjs-pino';

const serviceName = 'Gateway';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');

  app.useGlobalFilters(new GrpcExceptionFilter());
  app.useLogger(app.get(Logger));

  await app.listen(port);
  console.log(`[Service ${serviceName}] running on port: ${port}`);
}

bootstrap().catch((err) => {
  console.error(`Failed to start ${serviceName} service:`, err);
  process.exit(1);
});
