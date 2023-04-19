import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Movie, MovieDocument } from './models/movie.model';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}

  async getAllMovies(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [{ title: new RegExp(searchTerm, 'i') }],
      };

      return this.movieModel
        .find(options)
        .select('-__v')
        .sort({ createdAt: 'desc' })
        .exec();
    }

    return this.movieModel
      .find()
      .select('-__v')
      .populate('actors genres')
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async getMovieBySlug(slug: string) {
    const movie = await this.movieModel
      .findOne({ slug })
      .populate('actors genres');
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async getMovieById(movieId: string) {
    const movie = await this.movieModel.findById(movieId);

    if (!movie) throw new NotFoundException('Movie not found');

    return movie;
  }

  async getMovieByActor(actorId: Types.ObjectId) {
    const movies = await this.movieModel.find({ actors: actorId });

    if (!movies) throw new NotFoundException('Movie not found');

    return movies;
  }

  async getMovieByGenres(genresIds: Types.ObjectId[]) {
    const movies = await this.movieModel.find({ genres: { $in: genresIds } });

    if (!movies) throw new NotFoundException('Movie not found');

    return movies;
  }

  async updateCountOpened(slug: string) {
    const movie = await this.movieModel
      .findOneAndUpdate({ slug }, { $inc: { countOpened: 1 } }, { new: true })
      .exec();

    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async getMostPopularMovies() {
    const movies = await this.movieModel
      .find({ countOpened: { $gt: 0 } })
      .sort({ countOpened: -1 })
      .populate('genres');

    if (!movies) throw new NotFoundException('Movie not found');

    return movies;
  }

  async updateRating(id: Types.ObjectId, newRating: number) {
    return this.movieModel
      .findByIdAndUpdate(id, { rating: newRating }, { new: true })
      .exec();
  }
  // Admin functions

  async createMovie() {
    const defaultValue: UpdateMovieDto = {
      poster: '',
      bigPoster: '',
      genres: [],
      actors: [],
      description: '',
      title: '',
      videoUrl: '',
      slug: '',
    };

    const movie = await this.movieModel.create(defaultValue);

    return movie._id;
  }

  async updateMovie(movieId: string, dto: UpdateMovieDto) {
    return this.movieModel
      .findByIdAndUpdate(movieId, dto, { new: true })
      .exec();
  }

  async deleteMovie(id: string) {
    return this.movieModel.findByIdAndDelete(id).exec();
  }
}
