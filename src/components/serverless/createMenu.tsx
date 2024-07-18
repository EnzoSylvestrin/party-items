'use server';

import prisma from "@/lib/prisma";

export async function createMenu(name: string) {
    const haveAnotherMenu = await prisma.menu.count({
        where: { name },
    });

    if (haveAnotherMenu) {
        throw new Error('Já existe um menu com esse nome!');
    }

    const menu = await prisma.menu.create({
        data: { name },
    });

    return menu;
}