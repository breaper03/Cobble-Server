import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { Cobblemon, searchPokemonSchema } from 'models/cobblemon/pokemon.model';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  create(@Body() Cobblemon: Cobblemon[]) {
    return this.pokemonService.create(Cobblemon);
  }

  @Get('search')
  async search(@Query() query: unknown) {
    const parse = searchPokemonSchema.safeParse(query);
    if (!parse.success) throw new BadRequestException(parse.error.flatten());

    const { q, page, limit } = parse.data;
    return this.pokemonService.searchByName(q, page, limit);
  }

  @Get()
  findAll(@Query() query: unknown) {
    const parse = searchPokemonSchema.safeParse(query);
    if (!parse.success) throw new BadRequestException(parse.error.flatten());

    const { page, limit } = parse.data;
    return this.pokemonService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(+id);
  }
}
