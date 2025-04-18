import { MongoClient, Db, Collection, Document } from "mongodb";
import { UrlProps } from "@/types";

const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) {
    throw new Error("MONGODB_URI environment variable is undefined");
}

const DB_NAME = "cs391-url-shortener";
export const URLS_COLLECTION = "urls-collection";

let client: MongoClient | null = null;
let db: Db | null = null;

async function connect(): Promise<Db> {
    if (!client) {
        client = new MongoClient(MONGO_URI);
        await client.connect();
    }
    return client.db(DB_NAME);
}

export default async function getCollection<T extends Document = Document>(
    collectionName: string,
): Promise<Collection<T>> {
    if (!db) {
        db = await connect();
    }
    return db.collection<T>(collectionName);
}

// Convenience function for the URL shortener collection
export async function getUrlsCollection(): Promise<Collection<UrlProps>> {
    return getCollection<UrlProps>(URLS_COLLECTION);
}