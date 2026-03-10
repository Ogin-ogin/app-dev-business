import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
    try {
        const snap = await adminDb
            .collection('chat_sessions')
            .where('specGenerated', '==', true)
            .orderBy('updatedAt', 'desc')
            .limit(100)
            .get();

        const sessions = await Promise.all(
            snap.docs.map(async (doc) => {
                const data = doc.data();

                // Check if a project (paid spec) exists for this session
                const projectSnap = await adminDb
                    .collection('projects')
                    .where('sessionId', '==', doc.id)
                    .limit(1)
                    .get();

                const project = projectSnap.empty ? null : {
                    id: projectSnap.docs[0].id,
                    ...projectSnap.docs[0].data(),
                };

                // Extract title from claudeCodeDoc or messages
                let title = '無題のヒアリング';
                if (project && (project as any).title) {
                    title = (project as any).title;
                } else if (data.claudeCodeDoc) {
                    const match = data.claudeCodeDoc.match(/^#\s+(.+)/m);
                    if (match) title = match[1].replace(' 開発仕様書', '').trim();
                }

                return {
                    id: doc.id,
                    title,
                    uid: data.uid || null,
                    messageCount: (data.messages || []).length,
                    claudeCodeDoc: data.claudeCodeDoc || null,
                    createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
                    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
                    paid: !!project,
                    projectId: project ? (project as any).id : null,
                    projectStatus: project ? (project as any).status : null,
                };
            })
        );

        return NextResponse.json({ sessions });
    } catch (error: any) {
        console.error('Admin hearings error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch' }, { status: 500 });
    }
}
