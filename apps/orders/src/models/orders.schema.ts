import { AbstractDocument, PaymentStatusEnum } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class Item {
  @Prop()
  movieId: string;

  @Prop()
  unitPrice: number;
}

@Schema({ versionKey: false, collection: 'orders' })
export class OrderDocument extends AbstractDocument {
  @Prop()
  userId: string;

  @Prop()
  cardId: string;

  @Prop()
  totalAmount: number;

  @Prop({ type: String, enum: PaymentStatusEnum })
  paymentStatus: PaymentStatusEnum;

  @Prop()
  items: Item[];

  @Prop()
  createdAt: string;
}

export const OrderSchema = SchemaFactory.createForClass(OrderDocument);
