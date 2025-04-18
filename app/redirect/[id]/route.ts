import { NextRequest, NextResponse } from 'next/server';
import { getUrlsCollection } from '@/db';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params; // Await params for compatibility with Next.js 15+
    const urls = await getUrlsCollection();

    const urlDoc = await urls.findOne({ alias: id });

    if (urlDoc) {
        return NextResponse.redirect(urlDoc.originalUrl, 302);
    } else {
        return NextResponse.json({ error: 'Alias not found.' }, { status: 404 });
    }
}
