import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './models/user.model';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUserProfile(userId: string) {
    const user = await this.userModel.findById(userId);

    return user;
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.getUserProfile(userId);
    const isSameUser = await this.userModel.findOne({ email: dto.email });

    if (isSameUser && String(user._id) !== String(isSameUser._id)) {
      throw new ForbiddenException('Email already taken');
    }

    user.email = dto.email;

    if (user.isAdmin || dto.isAdmin === false) {
      user.isAdmin = dto.isAdmin;
    }

    await user.save();

    return { email: user.email, isAdmin: user.isAdmin };
  }

  async getUsersCount() {
    return this.userModel.find().count().exec();
  }

  async getAllUsers(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = { $or: [{ email: new RegExp(searchTerm, 'i') }] };

      return this.userModel
        .find(options)
        .select('-password -updatedAt -__v')
        .sort({ createdAt: 'desc' })
        .exec();
    }

    return this.userModel
      .find()
      .select('-password -updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async getUseRById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async toggleFavorites(movieId: Types.ObjectId, user: User) {
    const { _id, favorites } = user;
    await this.userModel.findByIdAndUpdate(_id, {
      favorites: favorites.includes(movieId)
        ? favorites.filter((id) => String(id) !== String(movieId))
        : [...favorites, movieId],
    });
  }

  async getFavoriteMovies(_id: Types.ObjectId) {
    return this.userModel
      .findById(_id, 'favorites')
      .populate({
        path: 'favorites',
        populate: {
          path: 'genres',
        },
      })
      .exec()
      .then((data) => data.favorites);
  }
}
