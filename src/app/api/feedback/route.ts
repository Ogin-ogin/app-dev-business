import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId, rating, comment } = body;

        if (!productId || !rating) {
            return NextResponse.json({ error: 'productId and rating are required' }, { status: 400 });
        }

        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'rating must be between 1 and 5' }, { status: 400 });
        }

        const docRef = await adminDb.collection('feedbacks').add({
            productId,
            rating,
            comment: comment || '',
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, id: docRef.id });
    } catch (error) {
        console.error('Feedback POST error:', error);
        return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
    }
}
