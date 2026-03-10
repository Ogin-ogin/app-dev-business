import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import type { FumanCategory } from '@/types/firestore';

const ALL_CATEGORIES: FumanCategory[] = [
  'economy', 'politics', 'healthcare', 'education', 'work',
  'housing', 'transport', 'food', 'service', 'tech', 'other',
];

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection('fuman_posts')
      .select('category')
      .get();

    const counts: Record<string, number> = {};
    for (const cat of ALL_CATEGORIES) {
      counts[cat] = 0;
    }

    for (const doc of snapshot.docs) {
      const category = doc.data().category as string;
      if (category in counts) {
        counts[category]++;
      } else {
        counts['other'] = (counts['other'] || 0) + 1;
      }
    }

    const categories = ALL_CATEGORIES.map((name) => ({
      name,
      count: counts[name] || 0,
    })).filter((c) => c.count > 0);

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('GET /api/fuman-radar/categories error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
