import { NextResponse } from 'next/server';
import { getSettings, writeSettings } from '@/lib/data';

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function PUT(request: Request) {
  const body = await request.json();
  await writeSettings(body);
  return NextResponse.json({ success: true });
}
