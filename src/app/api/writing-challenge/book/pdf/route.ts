import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ReactPDF from '@react-pdf/renderer';
import { BookDocument } from '@/components/challenge/book-pdf';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { registrationId } = await request.json();

    const registration = await prisma.writingChallengeRegistration.findFirst({
      where: { id: registrationId, userId: session.user.id, paymentStatus: 'PAID' },
      include: {
        challenge: { select: { title: true } },
        dailyPoems: { orderBy: { dayNumber: 'asc' } },
        user: { select: { name: true } },
      },
    });

    if (!registration) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const poems = registration.dailyPoems.map((p) => ({
      dayNumber: p.dayNumber,
      title: p.title,
      content: extractText(p.content),
      wordCount: p.wordCount,
    }));

    const bookData = {
      title: registration.bookTitle || 'My Poetry Collection',
      subtitle: registration.bookSubtitle || '#TheWriteAngle',
      authorName: registration.user.name || 'Unknown Author',
      authorBio: registration.authorBioForBook || '',
      dedication: registration.dedication || '',
      acknowledgments: registration.acknowledgments || '',
      template: registration.coverTemplate || 'classic',
      poems,
    };

    // Server-side PDF rendering
    const pdfStream = await ReactPDF.renderToStream(
      BookDocument(bookData),
    );

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of pdfStream as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${bookData.title.replace(/[^a-zA-Z0-9 ]/g, '')}.pdf"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('[Book PDF] Error:', error);
    return NextResponse.json(
      { error: 'PDF generation failed' },
      { status: 500 },
    );
  }
}

function extractText(content: any): string {
  if (!content?.content) return '';
  return content.content
    .map((node: any) =>
      node.content?.map((c: any) => c.text || '').join('') ?? '',
    )
    .join('\n');
}
