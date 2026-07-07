import { NextResponse } from 'next/server';
import { getOrders, writeOrders } from '@/lib/data';

export async function GET() {
  return NextResponse.json(getOrders());
}

export async function POST(request: Request) {
  const body = await request.json();
  const orders = getOrders();
  orders.push(body);
  await writeOrders(orders);
  return NextResponse.json({ success: true, order: body });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...data } = body;
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  orders[idx] = { ...orders[idx], ...data };
  await writeOrders(orders);
  return NextResponse.json({ success: true });
}
