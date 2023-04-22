import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/models/user.model';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const existUser = await this.userModel.findOne({ email: dto.email });

    if (existUser) {
      throw new BadRequestException('User already exist');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(dto.password, salt);

    const newUser = new this.userModel({ email: dto.email, password: hash });
    const tokens = await this.generateTokens(newUser._id);
    newUser.save();
    return { user: this.returnUser(newUser), ...tokens };
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);

    const tokens = await this.generateTokens(user._id);

    return { user: this.returnUser(user), ...tokens };
  }

  async validateUser(dto: AuthDto) {
    const user = await this.userModel.findOne({ email: dto.email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async refreshTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const validate = await this.jwtService.verifyAsync(refreshToken);

    if (!validate) {
      throw new UnauthorizedException('Token expired');
    }

    const user = await this.userModel.findById(validate._id);

    const tokens = await this.generateTokens(user._id);

    return { user: this.returnUser(user), ...tokens };
  }

  async generateTokens(userId: string) {
    const data = { _id: userId };

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }

  returnUser(user: User) {
    return {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }
}
