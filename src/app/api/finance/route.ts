import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const year = searchParams.get('year') || new Date().getFullYear().toString();
        const month = searchParams.get('month') || '';

        let query = adminDb.collection('finances').orderBy('date', 'desc');

        const snapshot = await query.limit(200).get();

        let entries = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: data.date?.toDate?.()?.toISOString?.() || data.date,
            };
        });

        // Filter by year/month
        if (year) {
            entries = entries.filter((e: any) => {
                const d = new Date(e.date);
                if (month) {
                    return d.getFullYear().toString() === year && (d.getMonth() + 1).toString() === month;
                }
                return d.getFullYear().toString() === year;
            });
        }

        return NextResponse.json({ entries }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching finances:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, category, amount, date, memo } = body;

        if (!type || !category || !amount || !date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const docRef = await adminDb.collection('finances').add({
            type,        // 'income' | 'expense'
            category,
            amount: Number(amount),
            date: new Date(date),
            memo: memo || '',
            createdAt: new Date(),
        });

        return NextResponse.json({ id: docRef.id }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating finance entry:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

        await adminDb.collection('finances').doc(id).delete();
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
