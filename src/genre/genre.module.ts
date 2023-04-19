import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Genre, GenreSchema } from './models/genre.model';
import { MovieService } from 'src/movie/movie.service';

@Module({
  providers: [GenreService],
  controllers: [GenreController],
  imports: [
    MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
    ConfigModule,
    MovieService,
  ],
})
export class GenreModule {}
