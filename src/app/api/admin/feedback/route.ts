import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
    try {
        const snap = await adminDb
            .collection('feedbacks')
            .orderBy('createdAt', 'desc')
            .limit(100)
            .get();

        const feedbacks = snap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt ?? null,
            };
        });

        return NextResponse.json({ feedbacks });
    } catch (error) {
        console.error('Admin feedback GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch feedbacks' }, { status: 500 });
    }
}
