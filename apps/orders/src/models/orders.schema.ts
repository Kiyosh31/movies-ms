import { AbstractDocument } from '@app/common';
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
  id: string;

  @Prop()
  userId: string;

  @Prop()
  orderDate: string;

  @Prop()
  totalAmount: number;

  @Prop()
  paymentStatus: string;

  @Prop()
  paymentMethod: string;

  @Prop()
  items: Item[];

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const OrderSchema = SchemaFactory.createForClass(OrderDocument);
