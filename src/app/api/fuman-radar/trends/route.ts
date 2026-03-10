import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection('fuman_trends')
      .orderBy('id', 'desc')
      .limit(30)
      .get();

    const trends = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ trends });
  } catch (error) {
    console.error('GET /api/fuman-radar/trends error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
