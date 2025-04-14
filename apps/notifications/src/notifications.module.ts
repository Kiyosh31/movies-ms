import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule, LoggerModule } from '@app/common';
import {
  NotificationDocument,
  NotificationSchema,
} from './models/notifications.schema';
import { NotificationRepository } from './repository/notification.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATIONS_QUEUE, NOTIFICATIONS_QUEUE_SERVICE } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: NotificationDocument.name, schema: NotificationSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_QUEUE_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: NOTIFICATIONS_QUEUE,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationRepository],
})
export class NotificationsModule {}
