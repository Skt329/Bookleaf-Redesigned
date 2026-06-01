import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPoemFeedback } from '@/lib/ai/services';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, text } = await request.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 },
      );
    }

    const result = await getPoemFeedback(title || 'Untitled', text);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('[AI Feedback] Error:', error);
    return NextResponse.json(
      { error: 'Feedback generation failed' },
      { status: 500 },
    );
  }
}
