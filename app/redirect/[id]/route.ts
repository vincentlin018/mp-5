import { NextRequest, NextResponse } from 'next/server';
import { getUrlsCollection } from '@/db';

export async function GET(
    _req: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params; // <-- await params
    const urls = await getUrlsCollection();

    const urlDoc = await urls.findOne({ alias: id });

    if (urlDoc) {
        return NextResponse.redirect(urlDoc.originalUrl, 302);
    } else {
        return NextResponse.json({ error: 'Alias not found.' }, { status: 404 });
    }
}
