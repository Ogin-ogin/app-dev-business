import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const year = searchParams.get('year') || '';
        const month = searchParams.get('month') || '';
        const date = searchParams.get('date') || '';

        const snapshot = await adminDb.collection('lifelogs').orderBy('date', 'desc').limit(500).get();

        let entries = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                date: data.date?.toDate?.()?.toISOString?.() || data.date,
                mood: data.mood,
                tags: data.tags || [],
                reflection: data.reflection || '',
                goalAchieved: data.goalAchieved || false,
                createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt,
            };
        });

        // Filter by date/year/month
        if (date) {
            entries = entries.filter(e => e.date.startsWith(date));
        } else if (year && month) {
            entries = entries.filter(e => {
                const d = new Date(e.date);
                return d.getFullYear().toString() === year && (d.getMonth() + 1).toString() === month;
            });
        } else if (year) {
            entries = entries.filter(e => new Date(e.date).getFullYear().toString() === year);
        }

        entries = entries.slice(0, limit);

        return NextResponse.json({ entries }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching lifelogs:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { date, mood, tags, reflection, goalAchieved } = body;

        if (!date || !mood) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const docRef = await adminDb.collection('lifelogs').add({
            date: new Date(date),
            mood: Number(mood),
            tags: tags || [],
            reflection: reflection || '',
            goalAchieved: goalAchieved || false,
            createdAt: new Date(),
        });

        return NextResponse.json({ id: docRef.id }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating lifelog:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

        await adminDb.collection('lifelogs').doc(id).delete();
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
