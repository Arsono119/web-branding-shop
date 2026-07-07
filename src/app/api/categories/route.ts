import { NextResponse } from 'next/server';
import { getCategories, writeCategories } from '@/lib/data';

export async function GET() {
  return NextResponse.json(getCategories());
}

export async function POST(request: Request) {
  const body = await request.json();
  const categories = getCategories();
  categories.push(body);
  await writeCategories(categories);
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...data } = body;
  const categories = getCategories();
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  categories[idx] = { ...categories[idx], ...data };
  await writeCategories(categories);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const categories = getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  await writeCategories(filtered);
  return NextResponse.json({ success: true });
}
