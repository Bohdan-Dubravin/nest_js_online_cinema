import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// export interface user {}

export type GenreDocument = HydratedDocument<Genre>;

@Schema({ timestamps: true })
export class Genre {
  _id: string;

  @Prop()
  name: string;
  @Prop({ unique: true })
  slug: string;
  @Prop()
  description: string;
  @Prop()
  icon: string;

  createdAt: Date;

  updatedAt: Date;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
