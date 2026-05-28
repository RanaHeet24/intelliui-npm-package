import { NextResponse } from 'next/server';
import { streamGeminiResponse } from '@intelliui/ai-chat/server';

/**
 * Next.js App Router POST Route POST handler for /api/chat.
 * 
 * Securely ingests conversation logs, calls Gemini, and streams the responses
 * back to the IntelliUI React client without exposing private API keys to the frontend.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    // 1. Validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'A non-empty messages array is required.' },
        { status: 400 }
      );
    }

    // 2. Fetch secure server-side API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[IntelliUI Server] GEMINI_API_KEY environment variable is missing.');
      return NextResponse.json(
        { error: 'Gemini server API Key is not configured.' },
        { status: 500 }
      );
    }

    // 3. Call the Gemini server wrapper to obtain the stream
    const stream = await streamGeminiResponse(messages, apiKey);

    // 4. Return as Chunked UTF-8 Stream for Real-time Frontend Orchestration
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error: any) {
    console.error('[IntelliUI Server] Next.js Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error encountered.' },
      { status: 500 }
    );
  }
}
