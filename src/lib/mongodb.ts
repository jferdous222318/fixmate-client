import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
if (!uri) throw new Error("MONGODB_URI is missing in .env.local");

// cache the client so hot reload and serverless do not open new connections each time
const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };
export const client = globalForMongo._mongoClient ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") globalForMongo._mongoClient = client;

// SAME database name as the Express server, so both share the "user" collection
export const db = client.db(process.env.DB_NAME || "fixmate");