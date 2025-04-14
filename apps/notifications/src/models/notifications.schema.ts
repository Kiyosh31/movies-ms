import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, collection: 'notifications' })
export class NotificationDocument extends AbstractDocument {
  @Prop()
  id: string;

  @Prop()
  userId: string;

  @Prop()
  message: string;

  @Prop({ type: Object })
  data: Record<string, any>;
}

export const NotificationSchema =
  SchemaFactory.createForClass(NotificationDocument);
