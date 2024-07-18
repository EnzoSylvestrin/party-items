import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params } : { params: { menuId: string } }) {
  const { menuId } = params;
  const { name, quantity, price } = await req.json();
  
  try {
    const item = await prisma.item.create({
      data: {
        name,
        quantity,
        price,
        menuId: parseInt(menuId, 10),
      },
    });
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}