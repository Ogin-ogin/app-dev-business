import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { platform, content } = body;

        if (!platform || !content) {
            return NextResponse.json({ error: 'platform and content are required' }, { status: 400 });
        }

        if (!['twitter', 'linkedin', 'instagram'].includes(platform)) {
            return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
        }

        // Get current post
        const docRef = adminDb.collection('sns_posts').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const currentData = doc.data();
        const editedPosts = currentData?.editedPosts || {};

        // Update edited posts
        editedPosts[platform] = content;

        await docRef.update({
            editedPosts,
            updatedAt: new Date(),
        });

        return NextResponse.json({ success: true, editedPosts }, { status: 200 });
    } catch (error: any) {
        console.error('Error editing post:', error);
        return NextResponse.json({ error: 'Failed to edit post' }, { status: 500 });
    }
}
