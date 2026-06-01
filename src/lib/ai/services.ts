/**
 * BookLeaf AI Services
 *
 * High-level AI functions for ticket triage, response drafting,
 * and content generation. Uses the provider abstraction from @/lib/ai.
 */

import { z } from 'zod';
import { getAIProvider } from '@/lib/ai';

/* -----------------------------------------------------------------------
   Ticket Triage
   ----------------------------------------------------------------------- */

const TicketTriageSchema = z.object({
  suggestedCategory: z.enum([
    'ROYALTY_PAYMENTS',
    'ISBN_METADATA',
    'PRINTING_QUALITY',
    'DISTRIBUTION',
    'BOOK_STATUS',
    'GENERAL',
  ]),
  suggestedPriority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  reasoning: z.string(),
});

export type TicketTriage = z.infer<typeof TicketTriageSchema>;

/**
 * Analyze a support ticket and suggest category + priority.
 */
export async function triageTicket(
  subject: string,
  description: string,
  authorName?: string
): Promise<TicketTriage> {
  const ai = getAIProvider();

  const prompt = `You are a support ticket triage system for BookLeaf Publishing, an Indian self-publishing platform.

Analyze this support ticket and determine the most appropriate category and priority level.

CATEGORIES:
- ROYALTY_PAYMENTS: Issues about royalty calculations, payouts, payment delays, bank details
- ISBN_METADATA: Issues about ISBN assignment, book metadata, title changes, author name corrections
- PRINTING_QUALITY: Complaints about print quality, binding, paper, color accuracy
- DISTRIBUTION: Issues about book availability on platforms (Amazon, Flipkart), listing status
- BOOK_STATUS: Questions about manuscript processing status, timeline updates
- GENERAL: Everything else (account issues, general questions, feedback)

PRIORITY LEVELS:
- CRITICAL: Financial errors, books listed with wrong content, urgent legal issues
- HIGH: Payment delays >45 days, books unavailable on platforms, printing defects
- MEDIUM: Status update requests, metadata corrections, general publishing questions
- LOW: General feedback, feature requests, informational queries

TICKET:
Subject: ${subject}
Description: ${description}
${authorName ? `Author: ${authorName}` : ''}

Return your analysis as JSON with suggestedCategory, suggestedPriority, and reasoning fields.`;

  try {
    return await ai.generateJSON(prompt, TicketTriageSchema, {
      temperature: 0.2,
      maxTokens: 300,
    });
  } catch {
    // Fallback if AI is unavailable
    return {
      suggestedCategory: 'GENERAL',
      suggestedPriority: 'MEDIUM',
      reasoning: 'AI triage unavailable — defaulting to GENERAL/MEDIUM.',
    };
  }
}

/* -----------------------------------------------------------------------
   Draft Response
   ----------------------------------------------------------------------- */

/**
 * Generate a draft admin response for a support ticket.
 */
export async function draftTicketResponse(
  subject: string,
  description: string,
  category: string,
  authorName?: string,
  previousMessages?: string[]
): Promise<string> {
  const ai = getAIProvider();

  const context = previousMessages?.length
    ? `\nPREVIOUS MESSAGES:\n${previousMessages.map((m, i) => `${i + 1}. ${m}`).join('\n')}`
    : '';

  const prompt = `You are a friendly, professional support agent for BookLeaf Publishing, India's leading self-publishing platform.

Draft a helpful response to this support ticket. Be empathetic, clear, and actionable.

TICKET:
Subject: ${subject}
Category: ${category.replace(/_/g, ' ')}
Author: ${authorName || 'Unknown'}
Description: ${description}
${context}

GUIDELINES:
- Address the author by name if available
- Be warm and professional (Indian business culture)
- Provide specific next steps when possible
- Reference BookLeaf's 80% royalty split, quarterly payouts, 45-day payout window when relevant
- Keep response concise (2-3 paragraphs max)
- Don't make promises about specific timelines unless it's standard policy
- Sign off as "BookLeaf Support Team"`;

  try {
    const { text } = await ai.generateText(prompt, {
      temperature: 0.7,
      maxTokens: 500,
    });
    return text;
  } catch {
    return 'Unable to generate AI draft. Please compose a manual response.';
  }
}

/* -----------------------------------------------------------------------
   Book Description Generator
   ----------------------------------------------------------------------- */

/**
 * Generate a compelling book description from metadata.
 */
export async function generateBookDescription(
  title: string,
  genre: string,
  authorName: string,
  pageCount?: number | null,
  existingDescription?: string | null
): Promise<string> {
  const ai = getAIProvider();

  const prompt = `You are a book marketing copywriter for BookLeaf Publishing, India's leading self-publishing platform.

Write a compelling, engaging book description for a bookstore listing.

BOOK:
Title: ${title}
Genre: ${genre.replace(/_/g, ' ')}
Author: ${authorName}
${pageCount ? `Pages: ${pageCount}` : ''}
${existingDescription ? `Existing description (improve this): ${existingDescription}` : ''}

GUIDELINES:
- Write 2-3 engaging paragraphs
- Start with a hook that draws readers in
- Highlight the genre and themes
- End with a compelling reason to read
- Don't include review quotes or purchase links
- Keep it under 200 words
- Make it suitable for Amazon/Flipkart book listings`;

  try {
    const { text } = await ai.generateText(prompt, {
      temperature: 0.8,
      maxTokens: 400,
    });
    return text;
  } catch {
    return existingDescription || 'Description not available.';
  }
}

/* -----------------------------------------------------------------------
   Writing Challenge — Grammar Fix
   ----------------------------------------------------------------------- */

const GrammarFixSchema = z.object({
  corrected: z.string(),
  changes: z.array(
    z.object({
      original: z.string(),
      fixed: z.string(),
      reason: z.string(),
    }),
  ),
});

export type GrammarFix = z.infer<typeof GrammarFixSchema>;

/**
 * Fix grammar, spelling, and punctuation in text.
 */
export async function fixGrammar(text: string): Promise<GrammarFix> {
  const ai = getAIProvider();

  const prompt = `You are a professional editor. Fix grammar, spelling, and punctuation errors in the following text. Preserve the author's voice, style, and line breaks. This may be a poem — respect poetic license and intentional formatting.

TEXT:
${text}

Return JSON with:
- "corrected": the full corrected text
- "changes": array of objects with "original" (exact text that was wrong), "fixed" (correction), and "reason" (brief explanation)

If there are no errors, return the original text with an empty changes array.`;

  try {
    return await ai.generateJSON(prompt, GrammarFixSchema, {
      temperature: 0.2,
      maxTokens: 2048,
    });
  } catch (err) {
    console.error('[AI] fixGrammar failed:', err);
    throw new Error('Grammar check failed. Check your Azure OpenAI deployment name.');
  }
}

/* -----------------------------------------------------------------------
   Writing Challenge — Poem Feedback
   ----------------------------------------------------------------------- */

const PoemFeedbackSchema = z.object({
  overall: z.string(),
  tone: z.string(),
  imagery: z.string(),
  rhythm: z.string(),
  suggestions: z.array(z.string()),
});

export type PoemFeedback = z.infer<typeof PoemFeedbackSchema>;

/**
 * Get structured writing feedback for a poem.
 */
export async function getPoemFeedback(
  title: string,
  text: string,
): Promise<PoemFeedback> {
  const ai = getAIProvider();

  const prompt = `You are a poetry mentor and writing coach. Analyze this poem and provide constructive, encouraging feedback.

TITLE: ${title}
POEM:
${text}

Return JSON with:
- "overall": 2-3 sentences on the overall impression
- "tone": analysis of the tone and mood (1-2 sentences)
- "imagery": feedback on imagery and sensory details (1-2 sentences)
- "rhythm": feedback on rhythm, flow, and line breaks (1-2 sentences)
- "suggestions": array of 2-4 specific, actionable improvement suggestions`;

  try {
    return await ai.generateJSON(prompt, PoemFeedbackSchema, {
      temperature: 0.7,
      maxTokens: 800,
    });
  } catch (err) {
    console.error('[AI] getPoemFeedback failed:', err);
    throw new Error('Feedback generation failed. Check your Azure OpenAI deployment name.');
  }
}

/* -----------------------------------------------------------------------
   Writing Challenge — Handwriting Transcription (OCR)
   ----------------------------------------------------------------------- */

/**
 * Transcribe handwritten text from an image. Supports Hindi and English.
 */
export async function transcribeHandwriting(
  imageBase64: string,
  mimeType: string,
): Promise<{ transcription: string }> {
  const ai = getAIProvider();

  if (!ai.generateTextWithImage) {
    throw new Error('Vision model not available for handwriting transcription.');
  }

  const prompt = `You are an OCR specialist. Transcribe the handwritten text in this image accurately.

RULES:
- Preserve the original language (Hindi, English, or mixed)
- Maintain line breaks and stanza structure
- If text is in Hindi/Devanagari, transcribe in Devanagari script
- If text is in English, transcribe in English
- If mixed, maintain both scripts
- Only return the transcribed text, nothing else
- If the image doesn't contain readable text, return "Unable to read handwritten text from this image."`;

  try {
    const { text } = await ai.generateTextWithImage(
      prompt,
      imageBase64,
      mimeType,
      { temperature: 0.1, maxTokens: 2048 },
    );
    return { transcription: text.trim() };
  } catch (err) {
    console.error('[AI] transcribeHandwriting failed:', err);
    throw new Error('Transcription failed. Check your Azure OpenAI deployment name.');
  }
}
