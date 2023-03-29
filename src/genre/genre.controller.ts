import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidPipe } from 'src/user/pipes/id-validetion.pipe';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreService } from './genre.service';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('slug/:slug')
  async getGenre(@Param('slug') slug: string) {
    return this.genreService.getGenreBySlug(slug);
  }

  @Get('collections')
  async getCollections() {
    return this.genreService.getCollections();
  }

  @Get()
  async getAllGenres(@Query('searchTerm') searchTerm?: string) {
    return this.genreService.getAllGenres(searchTerm);
  }

  @Get(':id')
  @Auth('admin')
  async getById(@Param('id', IdValidPipe) id: string) {
    return this.genreService.getGenreById(id);
  }

  @Patch(':id')
  @Auth('admin')
  async updateGenre(
    @Param('id', IdValidPipe) id: string,
    @Body() dto: CreateGenreDto,
  ) {
    return this.genreService.updateGenre(id, dto);
  }
}
