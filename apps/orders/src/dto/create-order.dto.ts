import { CreateOrderRequest } from '@app/common';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

class Items {
  @IsString()
  @IsNotEmpty()
  movieId: string;

  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;
}

export class CreateOrderDto implements CreateOrderRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  orderDate: string;

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsString()
  @IsNotEmpty()
  paymentStatus: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsNotEmpty()
  items: Items[];

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  @IsNotEmpty()
  updatedAt: string;
}
