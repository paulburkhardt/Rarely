import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_TOKENS = 4000; // Adjust based on your needs
const MEMORY_WINDOW = 10; // Number of recent messages to keep in full
let systemPrompt = `You are Dr. Joni, a knowledgeable and compassionate ACM (Arrhythmogenic Cardiomyopathy) specialist. 
When asked about ACM, provide accurate information about ACM, its symptoms, management, and treatment options. 
Be supportive and professional while maintaining medical accuracy.
Give short and concise answers!
Please use markdown to format your answers.
For medical advice, provide a disclaimer that you are not a doctor and that you are not providing medical advice.
Also reference to specialists for mental advice`;


// Add rate limiting configuration
const RATE_LIMIT = 5; // messages per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds

// Store request timestamps by IP
const requestLog = new Map<string, number[]>();

// Add this function to handle rate limiting
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userRequests = requestLog.get(ip) || [];
  
  // Clean old requests
  const recentRequests = userRequests.filter(
    timestamp => now - timestamp < RATE_WINDOW
  );
  
  // Check if rate limit is exceeded
  if (recentRequests.length >= RATE_LIMIT) {
    return true;
  }
  
  // Update requests log
  recentRequests.push(now);
  requestLog.set(ip, recentRequests);
  return false;
}

async function summarizeMessages(messages: any[]) {
  try {
    const conversation = messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Please provide a brief, informative summary of the key points from this conversation. Focus on the most important information that would be relevant for continuing the discussion."
        },
        {
          role: "user",
          content: conversation
        }
      ],
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Summarization error:', error);
    return 'Error summarizing previous conversation.';
  }
}

export async function POST(req: Request) {
  try {
    // Get user IP
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          message: 'This chatbot is for demonstration purposes and is limited to 5 messages per minute. Please wait a moment before sending more messages.' 
        },
        { status: 429 }
      );
    }

    const { messages, documentContext } = await req.json();

    // If we have more messages than our window, summarize older ones
    let processedMessages = [...messages];
    if (messages.length > MEMORY_WINDOW) {
      const oldMessages = messages.slice(0, -MEMORY_WINDOW);
      const recentMessages = messages.slice(-MEMORY_WINDOW);
      
      const summary = await summarizeMessages(oldMessages);
      
      processedMessages = [
        {
          role: "system",
          content: `Previous conversation summary: ${summary}`
        },
        ...recentMessages
      ];
    }

    // Add document context if available
    if (documentContext) {
      systemPrompt += `\n\nContext from uploaded documents:\n${documentContext}`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...processedMessages
      ],
    });

    return NextResponse.json({
      message: completion.choices[0].message.content
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat' },
      { status: 500 }
    );
  }
}