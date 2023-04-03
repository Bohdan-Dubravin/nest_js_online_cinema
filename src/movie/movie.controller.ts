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
import { MovieService } from './movie.service';

@Controller('movies')
export class ActorController {
  constructor(private readonly movieService: MovieService) {}

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.movieService.getMovieBySlug(slug);
  }

  @Get('actor/:actorId')
  async getByActor(@Param('actorId') actorId: string) {
    return this.movieService.getMovieByActor(actorId);
  }

  @Get()
  async getAllActors(@Query('searchTerm') searchTerm?: string) {
    return this.movieService.getAllActors(searchTerm);
  }

  @Get(':id')
  @Auth('admin')
  async getById(@Param('id', IdValidPipe) id: string) {
    return this.movieService.getActorById(id);
  }

  @Post()
  @Auth('admin')
  async createGenre() {
    return this.movieService.createActor();
  }

  @Patch(':id')
  @Auth('admin')
  async updateGenre(
    @Param('id', IdValidPipe) id: string,
    @Body() dto: CreateActorDto,
  ) {
    return this.movieService.updateActor(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteById(@Param('id', IdValidPipe) id: string) {
    return this.movieService.deleteActor(id);
  }
}
