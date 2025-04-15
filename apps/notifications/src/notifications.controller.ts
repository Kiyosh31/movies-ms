import { Controller } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  EVENT_CREATED_MOVIE,
  EVENT_CREATED_ORDER,
  EVENT_CREATED_USER,
  EVENT_DELETED_MOVIE,
  EVENT_DELETED_USER,
  EVENT_UPDATED_MOVIE,
  EVENT_UPDATED_USER,
} from '@app/common';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // User
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

  // Movie
  @EventPattern(EVENT_CREATED_MOVIE)
  async handleMovieCreated(@Payload() data: any) {
    await this.notificationsService.handleMovieCreated(data);
  }

  @EventPattern(EVENT_UPDATED_MOVIE)
  async handleMovieUpdated(@Payload() data: any) {
    await this.notificationsService.handleMovieUpdated(data);
  }

  @EventPattern(EVENT_DELETED_MOVIE)
  async handleMovieDeleted(@Payload() data: any) {
    await this.notificationsService.handleMovieDeleted(data);
  }

  // Orders
  @EventPattern(EVENT_CREATED_ORDER)
  async handleOrderCreated(@Payload() data: any) {
    await this.notificationsService.handleOrderCreated(data);
  }
}
