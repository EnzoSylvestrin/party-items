'use server';

import prisma from "@/lib/prisma";

export async function getMenuData(menuName: string) {
  const menu = await prisma.menu.findUnique({
    where: { name: menuName },
    include: { items: true },
  });
  return menu;
}
  