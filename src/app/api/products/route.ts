import { NextResponse } from 'next/server';
import { getProducts, writeProducts } from '@/lib/data';

export async function GET() {
  return NextResponse.json(getProducts());
}

export async function POST(request: Request) {
  const body = await request.json();
  const products = getProducts();
  products.push(body);
  await writeProducts(products);
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...data } = body;
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  products[idx] = { ...products[idx], ...data };
  await writeProducts(products);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  await writeProducts(filtered);
  return NextResponse.json({ success: true });
}
