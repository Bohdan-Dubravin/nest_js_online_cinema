import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
constructor(@InjectModel()){}

  register(dto: any) {
    return this.
  }
}
