import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const CONTENT_DIR = join(process.cwd(), 'src', 'content');

export async function GET() {
  const filePath = join(CONTENT_DIR, 'settings.json');
  if (!existsSync(filePath)) return NextResponse.json({});
  return NextResponse.json(JSON.parse(readFileSync(filePath, 'utf-8')));
}

export async function PUT(request: Request) {
  const body = await request.json();
  const filePath = join(CONTENT_DIR, 'settings.json');
  writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf-8');
  return NextResponse.json({ success: true });
}
