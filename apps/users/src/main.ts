import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
// import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { USERS_PACKAGE_NAME } from '@app/common';
import { ConfigService } from '@nestjs/config';

const serviceName = 'Users';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  const configService = app.get(ConfigService);
  const url = configService.getOrThrow<string>('GRPC_URI');

  const microserviceApp =
    await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, {
      transport: Transport.GRPC,
      options: {
        package: USERS_PACKAGE_NAME,
        protoPath: join(__dirname, '../users.proto'),
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
