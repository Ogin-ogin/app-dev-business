import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
    try {
        const snap = await adminDb
            .collection('orders')
            .orderBy('createdAt', 'desc')
            .limit(100)
            .get();

        const orders = snap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt ?? null,
            };
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Admin orders GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
        }

        const validStatuses = ['pending', 'paid', 'delivered'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        await adminDb.collection('orders').doc(id).update({
            status,
            updatedAt: new Date(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Admin orders PATCH error:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
