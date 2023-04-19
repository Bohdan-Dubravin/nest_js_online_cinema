import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingSchema } from './models/genre.model';
import { ConfigModule } from '@nestjs/config';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  providers: [RatingService],
  controllers: [RatingController],
  imports: [
    MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]),
    ConfigModule,
    MovieModule,
  ],
})
export class RatingModule {}
