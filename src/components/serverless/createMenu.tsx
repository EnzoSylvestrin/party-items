import prisma from "@/lib/prisma";

export async function createMenu(name: string) {
    const menu = await prisma.menu.create({
        data: { name },
    });

    return menu;
}