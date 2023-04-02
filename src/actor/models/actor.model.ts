import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ActorDocument = HydratedDocument<Actor>;

@Schema({ timestamps: true })
export class Actor {
  @Prop()
  name: string;

  @Prop()
  photo: string;

  @Prop({ unique: true })
  slug: string;
}

export const ActorSchema = SchemaFactory.createForClass(Actor);
