import tsValidMongoDb, { Schema } from 'ts-valid-mongodb';
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string().trim(),
  firstname: z.string().min(3).max(15),
  lastname: z.string().min(3).max(15),
  nickname: z.string().min(3).max(15),
  // document: z.string().trim().min(7).max(8).regex(/^[0-9]{7,8}$/),
  email: z.string().trim().email(),
  password: z.string().min(8),
  createdAt: z.date(),
  updatedAt: z.date()
});

type IUser = z.infer<typeof UserSchema>;

const createUserModel = (db: tsValidMongoDb) =>
  db.createModel(
    new Schema('users', UserSchema, {
      versionKey: true,
      indexes: [{ key: { id: 1 }, unique: true }]
    })
  );

export { IUser, createUserModel, UserSchema };