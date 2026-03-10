import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { adminDb } from '@/lib/firebase-admin';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { platform, action } = body;

        if (!platform) {
            return NextResponse.json({ error: 'platform is required' }, { status: 400 });
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

        const data = doc.data();
        const currentContent = data?.editedPosts?.[platform] || data?.generatedPosts?.[platform];

        if (!currentContent) {
            return NextResponse.json({ error: 'No content found for this platform' }, { status: 404 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });

        let prompt = '';

        if (action === 'improve') {
            prompt = `Improve the following social media post to make it more engaging, clear, and effective. Keep it for ${platform === 'twitter' ? 'Twitter/X (max 280 chars)' : platform}. Return ONLY the improved post text, no explanations or formatting:\n\n${currentContent}`;
        } else if (action === 'shorten') {
            prompt = `Shorten the following social media post while keeping the main message. It's for ${platform === 'twitter' ? 'Twitter/X (max 280 chars)' : platform}. Return ONLY the shortened post text, no explanations or formatting:\n\n${currentContent}`;
        } else {
            // Default regenerate
            prompt = `Regenerate the following social media post with a fresh perspective. Keep it for ${platform === 'twitter' ? 'Twitter/X (max 280 chars)' : platform}. Maintain the same topic and tone. Return ONLY the new post text, no explanations or formatting:\n\n${currentContent}`;
        }

        const result = await model.generateContent(prompt);
        const newContent = result.response.text().trim();

        // Optionally save to editedPosts
        const editedPosts = data?.editedPosts || {};
        editedPosts[platform] = newContent;

        await docRef.update({
            editedPosts,
            updatedAt: new Date(),
        });

        return NextResponse.json({ content: newContent }, { status: 200 });
    } catch (error: any) {
        console.error('Error regenerating post:', error);
        return NextResponse.json({ error: 'Failed to regenerate post' }, { status: 500 });
    }
}
