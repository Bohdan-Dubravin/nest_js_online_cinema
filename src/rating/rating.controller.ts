import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { RatingService } from './rating.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/user.decorator';
import { IdValidPipe } from 'src/user/pipes/id-validetion.pipe';
import { Types } from 'mongoose';
import { CreateRatingDto } from './dto/create-genre.dto';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get('/:movieId')
  @Auth()
  async getBySlug(
    @User('id', IdValidPipe) _id: Types.ObjectId,
    @Param('movieId', IdValidPipe) movieId: Types.ObjectId,
  ) {
    return this.ratingService.getMovieByUser(movieId, _id);
  }

  @Post('set-rating')
  @Auth()
  @HttpCode(200)
  async getByGenres(
    @User('id', IdValidPipe) _id: Types.ObjectId,
    @Body() dto: CreateRatingDto,
  ) {
    return this.ratingService.setRating(_id, dto);
  }
}
