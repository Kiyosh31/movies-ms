import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Request } from 'express';
import { RpcException } from '@nestjs/microservices';
import { CreateOrderDto } from '@app/common';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request,
  ) {
    try {
      return await this.ordersService.createOrder(
        createOrderDto,
        req['user'].id,
      );
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @Get(':id')
  async getOrder(@Param('id') id: string, @Req() req: Request) {
    try {
      return await this.ordersService.getOrder(id, req['user'].id);
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
