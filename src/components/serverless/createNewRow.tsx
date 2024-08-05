'use server';

import prisma from "@/lib/prisma";

export async function createNewRow(menuId: string, userId: number, data: { [key: string]: string }) {
    const table = await prisma.table.findUnique({
        where: { menuId: Number(menuId) },
        include: {
            rows: true
        }
    });

    if (!table) {
        return { success: false, error: 'Table not found' };
    }

    const newRow = {
        data: data,
        tableId: table.id,
        userId: userId
    };

    await prisma.row.create({
        data: newRow
    });

    const tableWithRowUpdated = await prisma.table.findUnique({
        where: {
            id: table.id
        },
        include: {
            rows: true
        }
    });

    return { success: true, rows: tableWithRowUpdated?.rows };
}