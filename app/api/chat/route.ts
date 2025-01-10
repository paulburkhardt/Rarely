import { OpenAI } from 'openai';


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

export async function POST(req: Request) {
  try {
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