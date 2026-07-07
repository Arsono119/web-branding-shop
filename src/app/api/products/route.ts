import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const CONTENT_DIR = join(process.cwd(), 'src', 'content');

export async function GET() {
  const filePath = join(CONTENT_DIR, 'products.json');
  if (!existsSync(filePath)) return NextResponse.json([]);
  return NextResponse.json(JSON.parse(readFileSync(filePath, 'utf-8')));
}

export async function POST(request: Request) {
  const body = await request.json();
  const filePath = join(CONTENT_DIR, 'products.json');
  const products = existsSync(filePath) ? JSON.parse(readFileSync(filePath, 'utf-8')) : [];
  products.push(body);
  writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...data } = body;
  const filePath = join(CONTENT_DIR, 'products.json');
  if (!existsSync(filePath)) return NextResponse.json({ error: 'No data' }, { status: 404 });
  const products = JSON.parse(readFileSync(filePath, 'utf-8'));
  const idx = products.findIndex((p: { id: string }) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  products[idx] = { ...products[idx], ...data };
  writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const filePath = join(CONTENT_DIR, 'products.json');
  if (!existsSync(filePath)) return NextResponse.json({ error: 'No data' }, { status: 404 });
  const products = JSON.parse(readFileSync(filePath, 'utf-8'));
  const filtered = products.filter((p: { id: string }) => p.id !== id);
  writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf-8');
  return NextResponse.json({ success: true });
}
