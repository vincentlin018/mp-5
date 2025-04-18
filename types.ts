// Import the Document type from the MongoDB library
import type { Document } from "mongodb";

// Define a TypeScript type for URL properties, extending the MongoDB Document type
export type UrlProps = Document & {
    id: string;            // Unique identifier for the URL entry
    alias: string;         // Custom alias for the shortened URL
    originalUrl: string;   // The original (long) URL to be shortened
    createdAt: Date;       // Timestamp for when the URL was created
}

