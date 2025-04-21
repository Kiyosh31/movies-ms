import Stripe from 'stripe';

export class CreateChargeDto {
  userId: string;
  orderId: string;
  card: Stripe.PaymentMethodCreateParams.Card;
  amount: number;
}
