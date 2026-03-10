import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUidFromRequest } from '@/lib/get-uid-from-request';
import { base64ToEmbedding } from '@/lib/embeddings';
import { UMAP } from 'umap-js';

export async function GET() {
  try {
    const cacheDoc = await adminDb.collection('fuman_umap_cache').doc('latest').get();

    if (!cacheDoc.exists) {
      return NextResponse.json({ cache: null });
    }

    const data = cacheDoc.data()!;
    const coordinates = JSON.parse(data.coordinates || '[]');
    return NextResponse.json({
      cache: {
        coordinates,
        count: data.count,
        computedAt: data.computedAt?.toDate?.()?.toISOString?.() || null,
      },
    });
  } catch (error) {
    console.error('GET /api/fuman-radar/umap error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const uid = await getUidFromRequest(req);
    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all posts with embeddings (limit 5000)
    const snapshot = await adminDb
      .collection('fuman_posts')
      .orderBy('createdAt', 'desc')
      .limit(5000)
      .get();

    const posts = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        if (!data.embedding) return null;
        return {
          id: doc.id,
          category: data.category,
          sentiment: data.sentiment,
          embedding: data.embedding as string,
        };
      })
      .filter(Boolean) as { id: string; category: string; sentiment: number; embedding: string }[];

    if (posts.length < 4) {
      return NextResponse.json({ error: 'Not enough posts for UMAP (need at least 4)' }, { status: 400 });
    }

    const embeddings = posts.map((p) => base64ToEmbedding(p.embedding));

    const nNeighbors = Math.min(15, posts.length - 1);
    const umap = new UMAP({ nComponents: 2, nNeighbors, minDist: 0.1 });
    const result = umap.fit(embeddings);

    const coordinates = posts.map((p, i) => ({
      id: p.id,
      x: result[i][0],
      y: result[i][1],
      category: p.category,
      sentiment: p.sentiment,
    }));

    const now = new Date();
    await adminDb.collection('fuman_umap_cache').doc('latest').set({
      coordinates: JSON.stringify(coordinates),
      count: posts.length,
      computedAt: now,
    });

    return NextResponse.json({ count: posts.length, computedAt: now.toISOString() });
  } catch (error) {
    console.error('POST /api/fuman-radar/umap error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
