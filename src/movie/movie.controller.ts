import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  Post,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidPipe } from 'src/user/pipes/id-validetion.pipe';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieService } from './movie.service';
import { Types } from 'mongoose';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.movieService.getMovieBySlug(slug);
  }

  @Get('actor/:actorId')
  async getByActor(@Param('actorId', IdValidPipe) actorId: Types.ObjectId) {
    return this.movieService.getMovieByActor(actorId);
  }

  @Post('genres')
  async getByGenres(@Body('genreIds', IdValidPipe) genres: Types.ObjectId[]) {
    return this.movieService.getMovieByGenres(genres);
  }

  @Get('popular')
  async getMostPopular() {
    return this.movieService.getMostPopularMovies();
  }

  @Post('update-count-opened')
  @HttpCode(200)
  async updateCount(@Body() slug: string) {
    return this.movieService.updateCountOpened(slug);
  }

  @Get()
  async getAllMovies(@Query('searchTerm') searchTerm?: string) {
    return this.movieService.getAllMovies(searchTerm);
  }

  //admin routes

  @Get(':id')
  @Auth('admin')
  async getById(@Param('id', IdValidPipe) id: string) {
    return this.movieService.getMovieById(id);
  }

  @Post()
  @Auth('admin')
  @HttpCode(200)
  async createGenre() {
    return this.movieService.createMovie();
  }

  @Patch(':id')
  @Auth('admin')
  async updateGenre(
    @Param('id', IdValidPipe) id: string,
    @Body() dto: UpdateMovieDto,
  ) {
    return this.movieService.updateMovie(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteById(@Param('id', IdValidPipe) id: string) {
    return this.movieService.deleteMovie(id);
  }
}
