import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Actor, ActorDocument } from 'src/actor/models/actor.model';
import { Genre, GenreDocument } from 'src/genre/models/genre.model';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({ timestamps: true })
export class Movie {
  @Prop()
  poster: string;

  @Prop()
  bigPoster: string;

  @Prop({ unique: true })
  title: string;

  @Prop()
  parameters?: Parameter;

  @Prop({ default: 4.0 })
  rating?: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Genre.name })
  genres: [Genre];

  @Prop({ default: 0 })
  countOpened?: number;

  @Prop({ unique: true })
  videoUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Actor.name })
  actors: [Actor];

  @Prop({ unique: true })
  slug: string;

  @Prop({ default: false })
  isSendTelegram?: boolean;
}

export class Parameter {
  @Prop()
  year: number;

  @Prop()
  duration: number;

  @Prop()
  country: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
