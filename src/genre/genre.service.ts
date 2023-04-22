import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Genre, GenreDocument } from './models/genre.model';
import { CreateGenreDto } from './dto/create-genre.dto';
import { MovieService } from '../movie/movie.service';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private genreModel: Model<GenreDocument>,
    private readonly movieService: MovieService,
  ) {}

  async getGenreBySlug(slug: string) {
    const genre = await this.genreModel.findOne({ slug });
    if (!genre) throw new NotFoundException('Genre not found');

    return genre;
  }

  async getAllGenres(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          { name: new RegExp(searchTerm, 'i') },
          { slug: new RegExp(searchTerm, 'i') },
          { description: new RegExp(searchTerm, 'i') },
        ],
      };

      return this.genreModel
        .find(options)
        .select('-__v')
        .sort({ createdAt: 'desc' })
        .exec();
    }

    return this.genreModel
      .find()
      .select('-__v')
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async getCollections() {
    const genres = await this.getAllGenres();

    const collections = await Promise.all(
      genres.map(async (genre) => {
        const moviesByGenre = await this.movieService.getMovieByGenres([
          new Types.ObjectId(genre._id),
        ]);

        const result = {
          _id: String(genre._id),
          image: moviesByGenre[0].bigPoster,
          slug: genre.slug,
          title: genre.name,
        };
        return result;
      }),
    );

    return collections;
  }

  // Admin functions

  async getGenreById(genreId: string) {
    const genre = await this.genreModel.findById(genreId);

    return genre;
  }

  async createGenre() {
    const defaultValue: CreateGenreDto = {
      name: '',
      slug: '',
      description: '',
      icon: '',
    };

    const genre = await this.genreModel.create(defaultValue);

    return genre._id;
  }

  async updateGenre(genreId: string, dto: CreateGenreDto) {
    return this.genreModel
      .findByIdAndUpdate(genreId, dto, { new: true })
      .exec();
  }

  async deleteGenre(id: string) {
    return this.genreModel.findByIdAndDelete(id).exec();
  }
}
