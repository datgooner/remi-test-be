import { MongoMemoryServer } from "mongodb-memory-server";

let mongo: MongoMemoryServer;

export const setupTestMongooseModule = async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  return { uri };
};

export const closeMongoConnection = async () => {
  if (mongo) {
    await mongo.stop({ doCleanup: true });
  }
};
