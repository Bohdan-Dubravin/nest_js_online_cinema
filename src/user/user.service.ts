import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './models/user.model';
import { Model } from 'mongoose';
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
  }
}
