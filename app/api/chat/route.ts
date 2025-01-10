import { OpenAI } from 'openai';
import { headers } from 'next/headers';


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `You are Dr. Joni, a knowledgeable and compassionate ACM (Arrhythmogenic Cardiomyopathy) specialist. 
Provide clear, accurate information about ACM, its symptoms, management, and treatment options. 
Be supportive and professional while maintaining medical accuracy.
Try to give short and concise answers.
Please use markdown to format your answers.
For medical advice, provide a disclaimer that you are not a doctor and that you are not providing medical advice.
Also reference to specialists for mental advice`;

// Add rate limiting map outside the handler
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 3; // messages
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

export async function POST(req: Request) {
  try {
    // Get IP address from headers
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    const now = Date.now();
    const userRate = rateLimit.get(ip) || { count: 0, timestamp: now };
    
    // Reset count if outside window
    if (now - userRate.timestamp > RATE_LIMIT_WINDOW) {
      userRate.count = 0;
      userRate.timestamp = now;
    }
    
    // Check if rate limit exceeded
    if (userRate.count >= RATE_LIMIT) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Increment count
    userRate.count++;
    rateLimit.set(ip, userRate);

    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
    });

    console.log(completion.choices[0].message.content);

    return new Response(JSON.stringify({ message: completion.choices[0].message.content }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}