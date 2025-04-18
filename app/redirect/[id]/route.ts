// Import Next.js request/response helpers for route handling
import { NextRequest, NextResponse } from 'next/server';
// Import the MongoDB collection helper
import { getUrlsCollection } from '@/db';

// GET handler for /redirect/[id] dynamic route
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Next.js 15+ expects params as a Promise
) {
    // Await the params object and extract the dynamic 'id' from the URL
    const { id } = await params;

    // Get the MongoDB collection for URLs
    const urls = await getUrlsCollection();

    // Look up the original URL by its alias (id)
    const urlDoc = await urls.findOne({ alias: id });

    if (urlDoc) {
        // If found, redirect the user to the original URL (HTTP 302)
        return NextResponse.redirect(urlDoc.originalUrl, 302);
    } else {
        // If not found, return a JSON error response with HTTP 404 status
        return NextResponse.json({ error: 'Alias not found.' }, { status: 404 });
    }
}
