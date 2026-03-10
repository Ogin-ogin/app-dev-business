import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionId, spec, summary, claudeCodeDoc } = body;

        if (!spec) {
            return NextResponse.json({ error: 'spec is required' }, { status: 400 });
        }

        const docRef = await adminDb.collection('projects').add({
            title: spec.title || 'カスタムアプリ',
            spec,
            summary: summary || '',
            claudeCodeDoc: claudeCodeDoc || '',
            sessionId: sessionId || null,
            status: 'pending',
            createdAt: new Date(),
        });

        return NextResponse.json({ projectId: docRef.id }, { status: 201 });
    } catch (error: any) {
        console.error('Error saving spec:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
