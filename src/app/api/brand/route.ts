import { NextResponse } from 'next/server';
import { getBrand, writeBrand } from '@/lib/data';

export async function GET() {
  return NextResponse.json(getBrand());
}

export async function PUT(request: Request) {
  const body = await request.json();
  await writeBrand(body);
  return NextResponse.json({ success: true });
}
