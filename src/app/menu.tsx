import prisma from "@/lib/prisma";

export async function getMenus() {
    const menus = await prisma.menu.findMany({
        include: {
            items: true
        }
    });
    return menus;
}