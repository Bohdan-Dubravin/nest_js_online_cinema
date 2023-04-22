import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../user/models/user.model';
import { Movie } from '../../movie/models/movie.model';

export type RatingDocument = HydratedDocument<Rating>;

@Schema()
export class Rating {
  @Prop({ type: { type: Types.ObjectId, ref: User.name } })
  userId: Types.ObjectId;

  @Prop({ type: { type: Types.ObjectId, ref: Movie.name } })
  movieId: Types.ObjectId;

  @Prop()
  value: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
