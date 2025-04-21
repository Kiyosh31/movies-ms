import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  CreateOrderRequest,
  EVENT_PAYMENT_FAILED,
  EVENT_PAYMENT_SUCCESS,
  GetOrderRequest,
  OrdersServiceController,
  OrdersServiceControllerMethods,
} from '@app/common';
import { EventPattern, Payload } from '@nestjs/microservices';

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

  @EventPattern(EVENT_PAYMENT_SUCCESS)
  paymentSuccess(@Payload() data: any) {
    return this.ordersService.paymentSuccess(data);
  }

  @EventPattern(EVENT_PAYMENT_FAILED)
  paymentFailed(@Payload() data: any) {
    console.log('🚀 ~ OrdersController ~ paymentFailed ~ data:', data);
    return this.ordersService.paymentFailed(data.data);
  }
}
