'use server';

import prisma from "@/lib/prisma";

export async function deleteMenu(menuId: number) {
    const menu = await prisma.menu.delete({
        where: { id: menuId },
    });

    return menu;
}