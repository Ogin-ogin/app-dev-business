import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '20', 10);

        const snapshot = await adminDb
            .collection('sns_posts')
            .where('isFavorite', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();

        const posts = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            };
        });

        return NextResponse.json({ posts, total: posts.length }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching favorites:', error);
        return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }
}
