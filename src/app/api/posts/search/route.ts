import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q') || '';
        const tone = searchParams.get('tone') || '';
        const limit = parseInt(searchParams.get('limit') || '20', 10);

        let firestoreQuery = adminDb.collection('sns_posts').orderBy('createdAt', 'desc');

        // Tone filter
        if (tone) {
            firestoreQuery = firestoreQuery.where('tone', '==', tone) as any;
        }

        // Fetch posts
        const snapshot = await firestoreQuery.limit(100).get();

        let posts = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            };
        });

        // Client-side topic filter (Firestore doesn't support full-text search)
        if (query) {
            const lowerQuery = query.toLowerCase();
            posts = posts.filter((post: any) =>
                post.topic?.toLowerCase().includes(lowerQuery)
            );
        }

        // Apply limit
        posts = posts.slice(0, limit);

        return NextResponse.json({ posts, total: posts.length }, { status: 200 });
    } catch (error: any) {
        console.error('Error searching posts:', error);
        return NextResponse.json({ error: 'Failed to search posts' }, { status: 500 });
    }
}
