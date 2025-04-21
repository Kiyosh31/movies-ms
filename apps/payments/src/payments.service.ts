import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from './dto/create-charge.dto';
import {
  CreateNotificationDto,
  EVENT_CREATE_NOTIFICATION,
  EVENT_PAYMENT_FAILED,
  EVENT_PAYMENT_SUCCESS,
  NOTIFICATIONS_QUEUE,
  PAYMENTS_QUEUE,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_QUEUE)
    private notificationsClient: ClientProxy,
    @Inject(PAYMENTS_QUEUE)
    private paymentsClient: ClientProxy,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2025-03-31.basil',
      },
    );
  }

  async createCharge({ card, amount, userId, orderId }: CreateChargeDto) {
    const rabbitMqPayload: CreateNotificationDto = {
      userId,
      message: 'Payment in process',
      data: orderId,
    };

    try {
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: {
          token: 'tok_visa',
        },
      });

      rabbitMqPayload.data = { ...paymentMethod, orderId };
      this.notificationsClient.emit(EVENT_CREATE_NOTIFICATION, rabbitMqPayload);

      const paymentIntent: Stripe.PaymentIntent =
        await this.stripe.paymentIntents.create({
          payment_method: paymentMethod.id,
          amount: amount * 100,
          confirm: true,
          currency: 'usd',
          payment_method_types: ['card'],
        });

      const response = {
        orderId,
        paymentIntentId: paymentIntent.id,
      };
      this.paymentsClient.emit(EVENT_PAYMENT_SUCCESS, response);

      rabbitMqPayload.message = 'Payment success';
      rabbitMqPayload.data = response;
      this.notificationsClient.emit(EVENT_CREATE_NOTIFICATION, rabbitMqPayload);
    } catch (err) {
      rabbitMqPayload.message = 'Payment failed';
      rabbitMqPayload.data = { orderId, message: err.raw.message };

      this.notificationsClient.emit(EVENT_CREATE_NOTIFICATION, rabbitMqPayload);
      this.paymentsClient.emit(EVENT_PAYMENT_FAILED, rabbitMqPayload);
    }
  }
}
