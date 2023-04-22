import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rating, RatingDocument } from './models/genre.model';
import { Model, Types } from 'mongoose';
import { MovieService } from '../movie/movie.service';
import { CreateRatingDto } from './dto/create-genre.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
    private readonly movieService: MovieService,
  ) {}

  async getMovieByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
    return this.ratingModel
      .findOne({ movieId, userId })
      .select('value')
      .exec()
      .then((data) => (data ? data.value : 0));
  }

  async setRating(userId: Types.ObjectId, dto: CreateRatingDto) {
    const { movieId, value } = dto;

    const newRating = await this.ratingModel
      .findOneAndUpdate(
        {
          movieId,
          userId,
        },
        { movieId, userId, value },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      )
      .exec();

    const averageRating = await this.averageRatingOfMovie(movieId);

    await this.movieService.updateRating(movieId, averageRating);

    return newRating;
  }

  async averageRatingOfMovie(movieId: Types.ObjectId) {
    const moviesRating = await this.ratingModel.find({ movieId }).exec();
    console.log(moviesRating);

    return (
      moviesRating.reduce((acc, item) => {
        return acc + item.value;
      }, 0) / moviesRating.length
    );
  }
}
