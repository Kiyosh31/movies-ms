import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { OrderRepository } from './repository/orders.repository';
import {
  CreateNotificationDto,
  CreateOrderRequest,
  EVENT_CREATE_NOTIFICATION,
  NOTIFICATIONS_QUEUE_SERVICE,
  Order,
} from '@app/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OrderDocument } from './models/orders.schema';

import { status } from '@grpc/grpc-js';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject(NOTIFICATIONS_QUEUE_SERVICE) private rabbitMqClient: ClientProxy,
  ) {}

  onModuleInit() {}

  mapOrderDocumentToOrder(orderDocument: OrderDocument): Order {
    return {
      id: orderDocument._id.toString(),
      userId: orderDocument.userId,
      cardId: orderDocument.cardId,
      totalAmount: orderDocument.totalAmount,
      paymentStatus: orderDocument.paymentStatus,
      items: orderDocument.items,
      createdAt: orderDocument.createdAt,
    };
  }

  async createOrder(createOrderDto: CreateOrderRequest) {
    try {
      const createdOrder = await this.orderRepository.create(
        createOrderDto as Omit<OrderDocument, '_id'>,
      );

      const rabbitMqPayload: CreateNotificationDto = {
        userId: createOrderDto.userId,
        message: 'Order created',
        data: this.mapOrderDocumentToOrder(createdOrder),
      };
      this.rabbitMqClient.emit(EVENT_CREATE_NOTIFICATION, rabbitMqPayload);

      return this.mapOrderDocumentToOrder(createdOrder);
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }

  async getOrder(_id: string) {
    try {
      const foundOrder = await this.orderRepository.findOne({ _id });
      if (!foundOrder) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'Order not found',
        });
      }

      return this.mapOrderDocumentToOrder(foundOrder);
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }
}
