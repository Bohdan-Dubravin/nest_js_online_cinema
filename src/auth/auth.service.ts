import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user, UserDocument } from 'src/user/models/user.model';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(user.name) private userModel: Model<UserDocument>) {}

  async register(dto: AuthDto) {
    const existUser = await this.userModel.findOne({ email: dto.email });

    if (existUser) {
      throw new BadRequestException('User already exist');
    }
    const newUser = new this.userModel(dto);

    return newUser.save();
  }
}
