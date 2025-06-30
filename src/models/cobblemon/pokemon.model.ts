import tsValidMongoDb, { Schema } from 'ts-valid-mongodb';
import { z } from 'zod';

export const CobblemonSchema = z.object({
  id: z.number(),
  pokemon: z.string(),
  entry: z.string(),
  bucket: z.string(),
  weight: z.string(), // puedes convertir a number si prefieres validación estricta
  lvMin: z.string(),
  lvMax: z.string(),
  biomes: z.string(),
  excludedBiomes: z.nullable(z.string()).optional(),
  time: z.nullable(z.string()).optional(),
  weather: z.nullable(z.string()).optional(),
  multipliers: z.nullable(z.string()).optional(),
  context: z.nullable(z.string()).optional(),
  presets: z.nullable(z.string()).optional(),
  conditions: z.nullable(z.string()).optional(),
  anticonditions: z.nullable(z.string()).optional(),
  skylightmin: z.nullable(z.string()).optional(),
  skylightmax: z.nullable(z.string()).optional(),
  canseesky: z.nullable(z.string()).optional(),
  uniqueForm: z.nullable(z.string()).optional(),
  drops: z.nullable(z.string()).optional(),
  spawnSpecificDrops: z.nullable(z.string()).optional(),
});

export const searchPokemonSchema = z.object({
  q: z.string().optional().default(''), // permite cadena vacía
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const createCobblemonModel = (db: tsValidMongoDb) =>
  db.createModel(
    new Schema('pokemon', CobblemonSchema, {
      versionKey: true,
      indexes: [{ key: { idex: 1 }, unique: true }],
    }),
  );

export type SearchPokemon = z.infer<typeof searchPokemonSchema>;

export type Cobblemon = z.infer<typeof CobblemonSchema>;
