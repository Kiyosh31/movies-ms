import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, collection: 'movies' })
export class MovieDocument extends AbstractDocument {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  director: string;

  @Prop()
  year: number;

  @Prop()
  actors: string[];

  @Prop()
  genre: string;

  @Prop()
  rating: number;

  @Prop()
  price: number;
}

export const MovieSchema = SchemaFactory.createForClass(MovieDocument);
