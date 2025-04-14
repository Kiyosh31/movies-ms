import { Controller } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  EVENT_CREATED_USER,
  EVENT_DELETED_USER,
  EVENT_UPDATED_USER,
} from '@app/common';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern(EVENT_CREATED_USER)
  async handleUserCreated(@Payload() data: any) {
    await this.notificationsService.handleUserCreated(data);
  }

  @EventPattern(EVENT_UPDATED_USER)
  async handleUserUpdated(@Payload() data: any) {
    await this.notificationsService.handleUserUpdated(data);
  }

  @EventPattern(EVENT_DELETED_USER)
  async handleUserDeleted(@Payload() data: any) {
    await this.notificationsService.handleUserDeleted(data);
  }
}
