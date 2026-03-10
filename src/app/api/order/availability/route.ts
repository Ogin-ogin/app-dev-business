import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

const ORDER_LIMIT = 10;

export async function GET() {
    try {
        const snap = await adminDb.collection('projects')
            .where('status', 'in', ['pending', 'paid'])
            .count()
            .get();
        const activeCount = snap.data().count;
        const available = activeCount < ORDER_LIMIT;

        return NextResponse.json({
            available,
            activeCount,
            limit: ORDER_LIMIT,
            remaining: Math.max(0, ORDER_LIMIT - activeCount),
        });
    } catch (error: any) {
        // On error, allow access rather than blocking
        return NextResponse.json({ available: true, activeCount: 0, limit: ORDER_LIMIT, remaining: ORDER_LIMIT });
    }
}
