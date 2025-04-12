import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { ConfigService } from '@nestjs/config';

const serviceName = 'users';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');

  await app.listen(port);
  console.log(`[Service ${serviceName}] running on port: ${port}`);
}

bootstrap().catch((err) => {
  console.error(`Failed to start ${serviceName} service:`, err);
  process.exit(1);
});
