import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Actor, ActorSchema } from './models/actor.model';
import { ActorController } from './actor.controller';
import { ActorService } from './actor.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Actor.name, schema: ActorSchema }]),
    ConfigModule,
  ],
  controllers: [ActorController],
  providers: [ActorService],
})
export class ActorModule {}
