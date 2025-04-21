import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { OrderRepository } from './repository/orders.repository';
import {
  CreateNotificationDto,
  CreateOrderRequest,
  EVENT_CREATE_NOTIFICATION,
  EVENT_CREATE_PAYMENT,
  NOTIFICATIONS_QUEUE,
  Order,
  PAYMENTS_QUEUE,
  PaymentStatusEnum,
  UpdateOrderDto,
} from '@app/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OrderDocument } from './models/orders.schema';

import { status } from '@grpc/grpc-js';
import { CreateChargeDto } from 'apps/payments/src/dto/create-charge.dto';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject(NOTIFICATIONS_QUEUE)
    private notificationsClient: ClientProxy,
    @Inject(PAYMENTS_QUEUE) private paymentsClient: ClientProxy,
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

  async createOrder(createOrderRequest: CreateOrderRequest) {
    try {
      const createdOrder = await this.orderRepository.create(
        createOrderRequest as Omit<OrderDocument, '_id'>,
      );

      // create notification
      const rabbitMqPayload: CreateNotificationDto = {
        userId: createOrderRequest.userId,
        message: 'Order created and Processing',
        data: this.mapOrderDocumentToOrder(createdOrder),
      };
      this.notificationsClient.emit(EVENT_CREATE_NOTIFICATION, rabbitMqPayload);

      // create the payment
      const paymentPayload: CreateChargeDto = {
        userId: createOrderRequest.userId,
        orderId: createdOrder._id.toHexString(),
        amount: createOrderRequest.totalAmount,
        card: {
          cvc: createOrderRequest.card?.cvc,
          exp_month: createOrderRequest.card?.expMonth,
          exp_year: createOrderRequest.card?.expYear,
          number: createOrderRequest.card?.number,
        },
      };
      this.paymentsClient.emit(EVENT_CREATE_PAYMENT, paymentPayload);

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

  async updateOrder(_id: string, updateOrderDto: UpdateOrderDto) {
    try {
      await this.orderRepository.findOneAndUpdate(
        { _id },
        { $set: updateOrderDto },
      );
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }

  async paymentSuccess(data: any) {
    try {
      const order = await this.getOrder(data.orderId);
      const updateOrderDto: UpdateOrderDto = {
        ...order,
        paymentStatus: PaymentStatusEnum.SUCCEEDED,
      };
      await this.updateOrder(order.id, updateOrderDto);

      const rabbitMqPayload: CreateNotificationDto = {
        userId: order.userId,
        message: 'Order complete',
        data: order,
      };
      this.notificationsClient.emit(EVENT_CREATE_NOTIFICATION, rabbitMqPayload);
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }

  async paymentFailed(data: any) {
    try {
      const order = await this.getOrder(data.orderId);
      const updateOrderDto: UpdateOrderDto = {
        ...order,
        paymentStatus: PaymentStatusEnum.FAILED,
      };
      await this.updateOrder(order.id, updateOrderDto);

      const rabbitMqPayload: CreateNotificationDto = {
        userId: order.userId,
        message: 'Order failed',
        data: data.message,
      };
      this.notificationsClient.emit(EVENT_CREATE_NOTIFICATION, rabbitMqPayload);
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }
}
