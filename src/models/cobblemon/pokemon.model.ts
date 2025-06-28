import tsValidMongoDb, { Schema } from 'ts-valid-mongodb';
import { z } from 'zod';

export const CobblemonSchema = z.object({
  id: z.nullable(z.number()).optional(),
  Pokemon: z.string(),
  Entry: z.nullable(z.number()).optional(),
  Bucket: z.nullable(z.string()).optional(),
  Weight: z.nullable(z.number()).optional(),
  'min-level': z.nullable(z.number()).optional(),
  'max-level': z.nullable(z.number()).optional(),
  biomes: z.nullable(z.string()).optional(),
  excludedBiomes: z.nullable(z.string()).optional(),
  Time: z.nullable(z.string()).optional(),
  Weather: z.nullable(z.string()).optional(),
  Multipliers: z.nullable(z.any()).optional(),
  Context: z.nullable(z.string()).optional(),
  Presets: z.nullable(z.string()).optional(),
  Conditions: z.nullable(z.any()).optional(),
  Anticonditions: z.nullable(z.any()).optional(),
  skyLightMin: z.nullable(z.number()).optional(),
  skyLightMax: z.nullable(z.number()).optional(),
  canSeeSky: z.nullable(z.any()).optional(),
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
