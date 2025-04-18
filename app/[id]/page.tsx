import { redirect } from 'next/navigation';

export default async function IdPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    redirect(`/redirect/${id}`);
}

