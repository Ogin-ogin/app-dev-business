import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        const { projectId } = await params;

        if (!projectId) {
            return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
        }

        const doc = await adminDb.collection('projects').doc(projectId).get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const data = doc.data()!;

        return NextResponse.json({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt,
        }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
