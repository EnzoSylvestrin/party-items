import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: any }) {
    const { menuId } = params;
    const { name, quantity, price } = await req.json();
    const item = await prisma.item.create({
      data: {
        name,
        quantity,
        price,
        menuId: parseInt(menuId, 10),
      },
    });
    return NextResponse.json(item);
}