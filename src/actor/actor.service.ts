import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Actor, ActorDocument } from './models/actor.model';

import { CreateActorDto } from './dto/create-actor.dto';

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(Actor.name) private actorModel: Model<ActorDocument>,
  ) {}

  async getActorBySlug(slug: string) {
    const actor = await this.actorModel.findOne({ slug });
    if (!actor) throw new NotFoundException('Actor not found');
    return actor;
  }

  async getAllActors(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          { name: new RegExp(searchTerm, 'i') },
          { slug: new RegExp(searchTerm, 'i') },
        ],
      };

      return this.actorModel
        .find(options)
        .select('-__v')
        .sort({ createdAt: 'desc' })
        .exec();
    }

    return this.actorModel
      .find()
      .select('-__v')
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async getCollections() {
    const actors = await this.getAllActors();
  }

  // Admin functions

  async getActorById(genreId: string) {
    const actor = await this.actorModel.findById(genreId);

    if (!actor) throw new NotFoundException('Actor not found');

    return actor;
  }

  async createActor() {
    const defaultValue: CreateActorDto = {
      name: '',
      slug: '',
      photo: '',
    };

    const actor = await this.actorModel.create(defaultValue);

    return actor._id;
  }

  async updateActor(actorId: string, dto: CreateActorDto) {
    return this.actorModel
      .findByIdAndUpdate(actorId, dto, { new: true })
      .exec();
  }

  async deleteActor(id: string) {
    return this.actorModel.findByIdAndDelete(id).exec();
  }
}
