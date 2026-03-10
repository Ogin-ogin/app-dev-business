import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { isFavorite } = body;

        if (typeof isFavorite !== 'boolean') {
            return NextResponse.json({ error: 'isFavorite must be a boolean' }, { status: 400 });
        }

        await adminDb.collection('sns_posts').doc(id).update({
            isFavorite,
            updatedAt: new Date(),
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating favorite:', error);
        return NextResponse.json({ error: 'Failed to update favorite' }, { status: 500 });
    }
}
