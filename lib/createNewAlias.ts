"use server";
import getCollection, { URLS_COLLECTION } from "@/db";
import { UrlProps } from "@/types";
import type { Document, WithId } from "mongodb";

/**
 * Checks if a URL is reachable and returns an acceptable HTTP status.
 * Accepts 200s, 300s, and 400s (optionally reject 404s if you want).
 */
async function isUrlAcceptable(url: string): Promise<boolean> {
    try {
        // Try a HEAD request for efficiency (no body), follow redirects
        let res = await fetch(url, { method: "HEAD", redirect: "follow" });
        // If HEAD is not allowed (405), fallback to GET
        if (res.status === 405) {
            res = await fetch(url, { method: "GET", redirect: "follow" });
        }
        // Accept HTTP status codes 200-499 (optionally exclude 404 if desired)
        return res.status >= 200 && res.status < 500;
    } catch {
        // If any error occurs (network, DNS, etc.), consider URL unreachable
        return false;
    }
}

// Helper function to convert a MongoDB document to a plain UrlProps object
function serializeUrlDoc(doc: WithId<Document>): UrlProps {
    return {
        id: doc._id ? doc._id.toString() : doc.id,
        alias: doc.alias,
        originalUrl: doc.originalUrl,
        createdAt:
            doc.createdAt instanceof Date
                ? doc.createdAt
                : new Date(doc.createdAt),
    };
}

/**
 * Creates a new shortened URL alias in the database.
 * Returns { data } on success or { error } on failure.
 */
export default async function createNewAlias(
    alias: string,
    originalUrl: string,
    createdAt: Date
): Promise<{ data?: UrlProps; error?: string }> {
    // Validation: Ensure both alias and original URL are provided
    if (!alias || !originalUrl) {
        return { error: "Alias and URL are required." };
    }

    // Validation: Check if the original URL is syntactically valid
    try {
        new URL(originalUrl);
    } catch {
        return { error: "Invalid URL." };
    }

    // Validation: Check if the URL is reachable and returns a valid HTTP status
    const ok = await isUrlAcceptable(originalUrl);
    if (!ok) {
        return { error: "URL is not reachable or returned an invalid status code." };
    }

    // Get the MongoDB collection for URLs
    let urlsCollection;
    try {
        urlsCollection = await getCollection(URLS_COLLECTION);
    } catch {
        return { error: "Database connection failed." };
    }

    // Check if the alias already exists in the database
    let existing;
    try {
        existing = await urlsCollection.findOne({ alias });
    } catch {
        return { error: "Database query failed." };
    }
    if (existing) {
        return { error: "Alias already taken." };
    }

    // Prepare the new document to insert
    const doc = {
        alias,
        originalUrl,
        createdAt,
    };

    // Insert the new alias document into the collection
    let res;
    try {
        res = await urlsCollection.insertOne(doc);
    } catch {
        return { error: "DB insert failed." };
    }

    // Check if the insert was successful
    if (!res.acknowledged) {
        return { error: "DB insert failed." };
    }

    // Return the inserted document as a serializable object
    return {
        data: serializeUrlDoc({
            ...doc,
            _id: res.insertedId, // Include the generated MongoDB _id
        }),
    };
}
