import TsValidMongoDb from 'ts-valid-mongodb';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

function getMongoDBManager(dbName: string): TsValidMongoDb {
  const mongoDbUri = process.env.MONGO_URI ?? "";
  const client = new MongoClient(mongoDbUri);
  const db = TsValidMongoDb.createWithClient(client, dbName);
  console.info(`Init MongoDB connect to ${dbName} to URI: ${mongoDbUri}`);
  return db;
}

const backendDBManager = getMongoDBManager('money-manager-api');

export { backendDBManager };