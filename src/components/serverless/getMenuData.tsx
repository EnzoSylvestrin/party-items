'use server';

import prisma from "@/lib/prisma";

export async function getMenuData(menuId: string) {
  const menu = await prisma.menu.findUnique({
    where: { id: Number(menuId) },
    include: {
      Table: {
        include: {
          rows: {
            include: {
              user: true
            }
          },
        },
      },
    },
  });

  return menu;
}
  