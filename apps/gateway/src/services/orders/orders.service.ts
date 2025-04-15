import {
  CreateOrderRequest,
  ORDERS_SERVICE_NAME,
  OrdersServiceClient,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class OrdersService implements OnModuleInit {
  private ordersService: OrdersServiceClient;

  constructor(@Inject(ORDERS_SERVICE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.ordersService =
      this.client.getService<OrdersServiceClient>(ORDERS_SERVICE_NAME);
  }

  createOrder(createOrderDto: CreateOrderRequest) {
    return this.ordersService.createOrder(createOrderDto);
  }

  getOrder(id: string) {
    return this.ordersService.getOrder({ id });
  }
}
