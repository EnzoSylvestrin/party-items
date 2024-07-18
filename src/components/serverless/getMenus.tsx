'use server';

import prisma from "@/lib/prisma";

export async function getMenus() {
    const menus = await prisma.menu.findMany();
    return menus;
}