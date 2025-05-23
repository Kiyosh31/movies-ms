import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MoviesModule } from './movies.module';
import { MOVIES_PACKAGE_NAME } from '@app/common';
import { Logger } from 'nestjs-pino';

const serviceName = 'Movies';

async function bootstrap() {
  const app = await NestFactory.create(MoviesModule);
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);
  const url = configService.getOrThrow<string>('GRPC_URI');

  const microserviceApp =
    await NestFactory.createMicroservice<MicroserviceOptions>(MoviesModule, {
      transport: Transport.GRPC,
      options: {
        package: MOVIES_PACKAGE_NAME,
        protoPath: join(__dirname, '../movies.proto'),
        url,
      },
    });

  await microserviceApp.listen();
  console.log(`[Service ${serviceName}] is listening on port ${url}`);
}

bootstrap().catch((err) => {
  console.error(`Failed to start ${serviceName} service:`, err);
  process.exit(1);
});
