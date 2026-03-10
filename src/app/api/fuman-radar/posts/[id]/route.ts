import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUidFromRequest } from '@/lib/get-uid-from-request';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docRef = adminDb.collection('fuman_posts').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const data = doc.data()!;
    // Strip uid and embedding from public response
    const { uid: _uid, embedding: _embedding, ...rest } = data;
    return NextResponse.json({ post: { id: doc.id, ...rest } });
  } catch (error) {
    console.error('GET /api/fuman-radar/posts/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const uid = await getUidFromRequest(req);
    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const docRef = adminDb.collection('fuman_posts').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const data = doc.data()!;
    if (data.uid !== uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await docRef.delete();

    // Clean up associated empathies
    const empathiesSnapshot = await adminDb
      .collection('fuman_empathies')
      .where('postId', '==', id)
      .get();

    const batch = adminDb.batch();
    empathiesSnapshot.docs.forEach((empDoc) => {
      batch.delete(empDoc.ref);
    });
    if (!empathiesSnapshot.empty) {
      await batch.commit();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/fuman-radar/posts/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
