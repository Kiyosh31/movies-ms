import { CreateOrderRequest, PaymentStatusEnum } from '@app/common';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

class Items {
  @IsString()
  @IsNotEmpty()
  movieId: string;

  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;
}

class StripeCard {
  @IsString()
  @IsNotEmpty()
  cvc: string;

  @IsNumber()
  @IsNotEmpty()
  expMonth: number;

  @IsNumber()
  @IsNotEmpty()
  expYear: number;

  @IsString()
  @IsNotEmpty()
  number: string;
}

export class CreateOrderDto implements CreateOrderRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  cardId: string;

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsEnum(PaymentStatusEnum)
  @IsOptional()
  paymentStatus: PaymentStatusEnum;

  @IsNotEmpty()
  items: Items[];

  @IsString()
  @IsOptional()
  createdAt: string;

  @IsObject()
  @IsOptional()
  card: StripeCard;
}
