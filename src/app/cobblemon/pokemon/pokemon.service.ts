import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Cobblemon, CobblemonSchema, createCobblemonModel } from 'models/cobblemon/pokemon.model';
import { backendDBManager } from 'src/dependency-injection';

@Injectable()
export class PokemonService {
  model = createCobblemonModel(backendDBManager);
  async create(cobblemon: Cobblemon[]) {
    const isValid = cobblemon.map(cobble => CobblemonSchema.safeParse(cobble));

    if (!isValid.some(isValid => isValid.success)) return 'error';

    //? Se limpian los registros anteriores...
    await this.model.delete();

    //? Se agregan los pokemons a la BD...
    const newest = cobblemon.map(cobble => {
      const idex = randomUUID(); // se genera un id provisional
      const newCobble = { ...cobble, idex };
      return newCobble
    });

    await this.model.insertMany(newest);

    return 'This action push all pokemons to BD';
  }

  async searchByName(q: string, page: number, limit: number) {
    const regex = new RegExp(q, 'i')
    const filter = { Pokemon: regex }

    const skip = (page - 1) * limit

    const [results, total] = await Promise.all([
      this.model.find(filter, { skip: skip, limit: limit }),
      this.model.count(filter),
    ])

    return {
      results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }
  async findAll(page: number, limit: number) {
    const [results, total] = await Promise.all([
      this.model.find({}, { skip: (page - 1) * limit, limit: limit }),
      this.model.count(),
    ])

    return {
      results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findOne(id: number) {
    const data = await this.model.findOneBy({ id: id })
    return data;
  }
}
