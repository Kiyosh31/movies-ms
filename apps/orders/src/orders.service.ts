import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { OrderRepository } from './repository/orders.repository';
import {
  EVENT_CREATED_ORDER,
  NOTIFICATIONS_QUEUE_SERVICE,
  Order,
} from '@app/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OrderDocument } from './models/orders.schema';
import { CreateOrderDto } from './dto/create-order.dto';
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
      orderDate: orderDocument.orderDate,
      totalAmount: orderDocument.totalAmount,
      paymentStatus: orderDocument.paymentStatus,
      paymentMethod: orderDocument.paymentMethod,
      items: orderDocument.items,
      createdAt: orderDocument.createdAt,
      updatedAt: orderDocument.updatedAt,
    };
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      const createdOrder = await this.orderRepository.create(
        createOrderDto as Omit<OrderDocument, '_id'>,
      );

      this.rabbitMqClient.emit(
        EVENT_CREATED_ORDER,
        this.mapOrderDocumentToOrder(createdOrder),
      );

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
