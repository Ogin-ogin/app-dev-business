import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUidFromRequest } from '@/lib/get-uid-from-request';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const uid = await getUidFromRequest(req);
    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: postId } = await params;

    // Verify post exists
    const postRef = adminDb.collection('fuman_posts').doc(postId);
    const postDoc = await postRef.get();
    if (!postDoc.exists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Find existing empathy record
    const empathyQuery = await adminDb
      .collection('fuman_empathies')
      .where('postId', '==', postId)
      .where('uid', '==', uid)
      .limit(1)
      .get();

    let empathized: boolean;

    await adminDb.runTransaction(async (transaction) => {
      if (!empathyQuery.empty) {
        // Already empathized — remove it
        transaction.delete(empathyQuery.docs[0].ref);
        transaction.update(postRef, { empathyCount: FieldValue.increment(-1) });
        empathized = false;
      } else {
        // Not yet empathized — add it
        const newEmpathyRef = adminDb.collection('fuman_empathies').doc();
        transaction.set(newEmpathyRef, {
          postId,
          uid,
          createdAt: new Date(),
        });
        transaction.update(postRef, { empathyCount: FieldValue.increment(1) });
        empathized = true;
      }
    });

    return NextResponse.json({ empathized: empathized! });
  } catch (error) {
    console.error('POST /api/fuman-radar/posts/[id]/empathy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const uid = await getUidFromRequest(req);
    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: postId } = await params;

    const empathyQuery = await adminDb
      .collection('fuman_empathies')
      .where('postId', '==', postId)
      .where('uid', '==', uid)
      .limit(1)
      .get();

    return NextResponse.json({ empathized: !empathyQuery.empty });
  } catch (error) {
    console.error('GET /api/fuman-radar/posts/[id]/empathy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
