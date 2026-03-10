import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { isTemplate, templateName } = body;

        if (typeof isTemplate !== 'boolean') {
            return NextResponse.json({ error: 'isTemplate must be a boolean' }, { status: 400 });
        }

        const updateData: any = {
            isTemplate,
            updatedAt: new Date(),
        };

        if (isTemplate && templateName) {
            updateData.templateName = templateName;
        } else if (!isTemplate) {
            updateData.templateName = null;
        }

        await adminDb.collection('sns_posts').doc(id).update(updateData);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating template:', error);
        return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
    }
}
