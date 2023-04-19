import { IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRatingDto {
  @IsString()
  movieId: Types.ObjectId;

  @IsNumber()
  value: number;
}
