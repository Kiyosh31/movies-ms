import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Max, Min } from 'class-validator';

@Schema({ versionKey: false, collection: 'cards' })
export class CardDocument extends AbstractDocument {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  cardName!: string;

  @Prop({ required: true })
  number!: string;

  @Prop({ required: true })
  @Min(1)
  @Max(12)
  expMonth!: number;

  @Prop({ required: true })
  @Min(2000)
  @Max(2030)
  expYear!: number;

  @Prop({ required: true })
  cvc!: string;

  @Prop({ default: 'credit', enum: ['credit', 'debit'] })
  cardType: string;

  @Prop({ default: 'mastercard', enum: ['visa', 'mastercard'] })
  type: string;
}

export const CardSchema = SchemaFactory.createForClass(CardDocument);
