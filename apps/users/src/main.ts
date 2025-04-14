import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { join } from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { USERS_PACKAGE_NAME } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

const serviceName = 'Users';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);
  const grpcUrl = configService.getOrThrow<string>('GRPC_URI');

  // Configuración del microservicio gRPC
  const grpcMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, {
      transport: Transport.GRPC,
      options: {
        package: USERS_PACKAGE_NAME,
        protoPath: join(__dirname, '../users.proto'),
        url: grpcUrl,
      },
    });

  await grpcMicroservice.listen();
  console.log(`[Service ${serviceName}] is listening on port ${grpcUrl}`);
}

bootstrap().catch((err) => {
  console.error(`Failed to start service:`, err);
  process.exit(1);
});
