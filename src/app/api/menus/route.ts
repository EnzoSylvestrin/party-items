import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  const menu = await prisma.menu.create({
    data: { name },
  });
  return NextResponse.json(menu);
}