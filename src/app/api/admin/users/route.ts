import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
    try {
        const snap = await adminDb
            .collection('users')
            .orderBy('createdAt', 'desc')
            .limit(100)
            .get();

        const users = snap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt ?? null,
                lastLoginAt: data.lastLoginAt?.toDate?.()?.toISOString() ?? data.lastLoginAt ?? null,
            };
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Admin users GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
