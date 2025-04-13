import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MoviesModule } from './movies.module';
import { MOVIES_PACKAGE_NAME } from '@app/common';

const serviceName = 'Movies';

async function bootstrap() {
  const app = await NestFactory.create(MoviesModule);
  const configService = app.get(ConfigService);

  const microserviceApp =
    await NestFactory.createMicroservice<MicroserviceOptions>(MoviesModule, {
      transport: Transport.GRPC,
      options: {
        package: MOVIES_PACKAGE_NAME,
        protoPath: join(__dirname, '../movies.proto'),
        url: configService.getOrThrow<string>('GRPC_URI'),
      },
    });

  await microserviceApp.listen();
  console.log(`[Service ${serviceName}] is listening on port 5001`);
}

bootstrap().catch((err) => {
  console.error(`Failed to start ${serviceName} service:`, err);
  process.exit(1);
});
