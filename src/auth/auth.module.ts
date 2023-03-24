import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { user, UserSchema } from 'src/user/models/user.model';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([{ name: user.name, schema: UserSchema }]),
    ConfigModule,
  ],
})
export class AuthModule {}
