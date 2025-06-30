import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  Cobblemon,
  CobblemonSchema,
  createCobblemonModel,
} from 'src/models/cobblemon/pokemon.model';
import { backendDBManager } from 'src/dependency-injection';

@Injectable()
export class PokemonService {
  model = createCobblemonModel(backendDBManager);
  async create(cobblemon: Cobblemon[]) {
    const isValid = cobblemon.map((cobble) =>
      CobblemonSchema.safeParse(cobble),
    );

    if (!isValid.some(result => result.success)) {
      // Si ninguno es válido, sacamos todos los errores
      const errors = isValid
        .filter(result => !result.success)
        .map(result => result.error.errors); // extraemos el array de errores de Zod

      return {
        message: "error al cargar el JSON",
        errors: errors.flat(), // aplanamos el arreglo de errores
      };
    }

    //? Se limpian los registros anteriores...
    await this.model.delete();

    //? Se agregan los pokemons a la BD...
    const newest = cobblemon.map((cobble) => {
      const idex = randomUUID(); // se genera un id provisional
      const newCobble = { ...cobble, idex };
      return newCobble;
    });

    await this.model.insertMany(newest);

    return 'This action push all pokemons to BD';
  }
  async searchByName(q: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const regex = q.trim() ? new RegExp(q, 'i') : null;

    const filter = regex ? { pokemon: regex } : {};

    // 1. Traer todos los resultados que coincidan o todo si no hay filtro
    const all = [...(await this.model.find(filter))];

    // 2. Eliminar duplicados por nombre
    const seen = new Set<string>();
    const unique: Cobblemon[] = [];

    for (const poke of all) {
      if (!seen.has(poke.pokemon)) {
        seen.add(poke.pokemon);
        unique.push(poke);
      }
    }

    // 3. Paginar manualmente
    const total = unique.length;
    const results = unique.slice(skip, skip + limit);

    return {
      results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  async findAll(page: number, limit: number) {
    const [results, total] = await Promise.all([
      this.model.find({}, { skip: (page - 1) * limit, limit: limit }),
      this.model.count(),
    ]);

    return {
      results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const data = await this.model.findOneBy({ id: id });
    return data;
  }
}
