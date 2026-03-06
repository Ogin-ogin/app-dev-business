import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { adminDb } from '@/lib/firebase-admin';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { topic, tone } = body;

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
You are an expert social media manager.
Create 3 highly engaging social media posts about the following topic: "${topic}"
The desired tone of the posts should be: "${tone}".

You MUST return the output as a valid raw JSON object exactly with the following structure, and do not include markdown formatting like \`\`\`json:
{
  "twitter": "...",
  "linkedin": "...",
  "instagram": "..."
}

For Twitter (X): Keep it punchy, use relevant hashtags, max 280 characters.
For LinkedIn: Make it professional, engaging, structured with paragraphs, and encourage discussion.
For Instagram: Make it visually descriptive, use emojis, and include a block of relevant hashtags at the bottom.
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        let generatedPosts;
        try {
            // Attempt to parse the valid JSON
            // Sometimes Gemini wraps response in markdown block, so we strip it if present
            const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
            generatedPosts = JSON.parse(cleanedText);
        } catch (e) {
            console.error('Failed to parse Gemini response as JSON', responseText);
            return NextResponse.json({ error: 'Failed to process AI response' }, { status: 500 });
        }

        // Save to Firestore
        const docRef = await adminDb.collection('sns_posts').add({
            topic,
            tone,
            generatedPosts,
            createdAt: new Date(),
        });

        return NextResponse.json({
            id: docRef.id,
            result: generatedPosts
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error generating posts:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
