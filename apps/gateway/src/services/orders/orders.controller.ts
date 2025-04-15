import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderRequest } from '@app/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { OwnershipGuard } from '../../guards/ownership.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderRequest) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get(':id')
  // @UseGuards(OwnershipGuard)
  getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }
}
