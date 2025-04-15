import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  CreateOrderRequest,
  GetOrderRequest,
  OrdersServiceController,
  OrdersServiceControllerMethods,
} from '@app/common';

@Controller('orders')
@OrdersServiceControllerMethods()
export class OrdersController implements OrdersServiceController {
  constructor(private readonly ordersService: OrdersService) {}

  createOrder(request: CreateOrderRequest) {
    return this.ordersService.createOrder(request);
  }

  getOrder(request: GetOrderRequest) {
    return this.ordersService.getOrder(request.id);
  }
}
