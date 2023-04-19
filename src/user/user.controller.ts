import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdValidPipe } from './pipes/id-validetion.pipe';
import { Types } from 'mongoose';
import { UserDocument } from './models/user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@User('_id') userId: string) {
    return this.userService.getUserProfile(userId);
  }

  @Patch('update')
  @Auth()
  @HttpCode(200)
  async editUser(@User('_id') userId: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(userId, dto);
  }

  @Get('user-favorites')
  @Auth()
  async toggleFavorites(
    @User() user: UserDocument,
    @Body('movieId', IdValidPipe) movieId: Types.ObjectId,
  ) {
    return this.userService.toggleFavorites(movieId, user);
  }

  @Get('user-favorites')
  @Auth()
  async getFavoriteMovies(
    @User('_id') userId: Types.ObjectId,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.getFavoriteMovies(userId);
  }

  @Patch('update-admin/:id')
  @Auth('admin')
  @HttpCode(200)
  async editUserAdmin(
    @Param('id', IdValidPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(id, dto);
  }

  @Get('users')
  @Auth('admin')
  @HttpCode(200)
  async getAllUsers(@Query('searchTerm') searchTerm?: string) {
    return this.userService.getAllUsers(searchTerm);
  }

  @Get('users-count')
  @Auth('admin')
  @HttpCode(200)
  async getUsersCount() {
    return this.userService.getUsersCount();
  }

  @Get('/:id')
  @Auth('admin')
  async getUser(@Param('id', IdValidPipe) id: string) {
    return this.userService.getUseRById(id);
  }

  @Delete('delete/:id')
  @Auth('admin')
  async deleteUser(@Param('id', IdValidPipe) id: string) {
    return this.userService.deleteUser(id);
  }
}
