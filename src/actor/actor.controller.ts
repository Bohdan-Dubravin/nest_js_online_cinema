import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  Post,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidPipe } from 'src/user/pipes/id-validetion.pipe';
import { ActorService } from './actor.service';
import { CreateActorDto } from './dto/create-actor.dto';

@Controller('actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get('slug/:slug')
  async getActor(@Param('slug') slug: string) {
    return this.actorService.getActorBySlug(slug);
  }

  @Get('collections')
  async getCollections() {
    return this.actorService.getCollections();
  }

  @Get()
  async getAllActors(@Query('searchTerm') searchTerm?: string) {
    return this.actorService.getAllActors(searchTerm);
  }

  @Get(':id')
  @Auth('admin')
  async getById(@Param('id', IdValidPipe) id: string) {
    return this.actorService.getActorById(id);
  }

  @Post()
  @Auth('admin')
  async createGenre() {
    return this.actorService.createActor();
  }

  @Patch(':id')
  @Auth('admin')
  async updateGenre(
    @Param('id', IdValidPipe) id: string,
    @Body() dto: CreateActorDto,
  ) {
    return this.actorService.updateActor(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteById(@Param('id', IdValidPipe) id: string) {
    return this.actorService.deleteActor(id);
  }
}
