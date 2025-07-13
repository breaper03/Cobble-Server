import tsValidMongoDb, { Schema } from 'ts-valid-mongodb';
import { z } from 'zod';
const DropSchema = z.object({
  item: z.string(),
  probability: z.number(),
});

const FormObjectSchema = z.object({
  form: z.string(),
  rarity: z.string().nullable().optional(),
  conditions: z.string().nullable().optional(),
});

export const CobblemonSchema = z.object({
  id: z.number().int(),
  pokemon: z.string(),
  source: z.string(),
  biomes: z.array(z.string()),
  rarity: z.string().nullable(),
  conditions: z.array(z.string()),
  forms: z.array(z.union([z.string(), FormObjectSchema])),
  region: z.string(),
  generation: z.string(),
  weight: z.array(z.number()).nullable().optional(),
  lvMin: z.number().int().nullable().optional(),
  lvMax: z.number().int().nullable().optional(),
  excludedBiomes: z.string().nullable().optional(),
  time: z.string().nullable().optional(),
  weather: z.string().nullable().optional(),
  multipliers: z.any().nullable().optional(),
  context: z.string().nullable().optional(),
  presets: z.string().nullable().optional(),
  anticonditions: z.any().nullable().optional(),
  skylightMin: z.any().nullable().optional(),
  skylightMax: z.any().nullable().optional(),
  canSeeSky: z.any().nullable().optional(),
  drops: z.array(DropSchema).nullable().optional(),
  spawnSpecificDrops: z.any().nullable().optional(),
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
