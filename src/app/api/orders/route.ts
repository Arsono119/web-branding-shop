import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const CONTENT_DIR = join(process.cwd(), 'src', 'content');

export async function GET() {
  const filePath = join(CONTENT_DIR, 'orders.json');
  if (!existsSync(filePath)) return NextResponse.json([]);
  return NextResponse.json(JSON.parse(readFileSync(filePath, 'utf-8')));
}

export async function POST(request: Request) {
  const body = await request.json();
  const filePath = join(CONTENT_DIR, 'orders.json');
  const orders = existsSync(filePath) ? JSON.parse(readFileSync(filePath, 'utf-8')) : [];
  orders.push(body);
  writeFileSync(filePath, JSON.stringify(orders, null, 2), 'utf-8');
  return NextResponse.json({ success: true, order: body });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...data } = body;
  const filePath = join(CONTENT_DIR, 'orders.json');
  if (!existsSync(filePath)) return NextResponse.json({ error: 'No data' }, { status: 404 });
  const orders = JSON.parse(readFileSync(filePath, 'utf-8'));
  const idx = orders.findIndex((o: { id: string }) => o.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  orders[idx] = { ...orders[idx], ...data };
  writeFileSync(filePath, JSON.stringify(orders, null, 2), 'utf-8');
  return NextResponse.json({ success: true });
}
