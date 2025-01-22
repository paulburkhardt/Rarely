import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import os from 'os';
import path from 'path';

export async function POST(req: Request) {
  return new Response(JSON.stringify({ text: "Mock transcription for local development" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}


