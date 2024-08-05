'use server';

import prisma from "@/lib/prisma";

export async function createMenu(name: string) {
    const haveAnotherMenu = await prisma.menu.count({
        where: { name },
    });

    if (haveAnotherMenu) {
        throw new Error('Já existe um menu com esse nome!');
    }

    const result = await prisma.$transaction(async (prisma) => {
        const menu = await prisma.menu.create({
            data: { name },
        });

        const table = await prisma.table.create({
            data: {
                menuId: menu.id,
                columns: [],
            },
        });

        await prisma.menu.update({
            where: { id: menu.id },
            data: { tableId: table.id },
        });

        return { menu, table };
    });

    return result.menu;
}