// Import the redirect utility from Next.js for client/server navigation
import { redirect } from 'next/navigation';

// Page component for dynamic [id] routes
// This component receives the dynamic 'id' from the URL params
export default async function IdPage({ params }: { params: Promise<{ id: string }> }) {
    // Await the params to extract the 'id' value
    const { id } = await params;

    // Immediately redirect the user to the /redirect/[id] route
    redirect(`/redirect/${id}`);
}
