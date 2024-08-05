'use server';

import prisma from "@/lib/prisma";

import { Prisma } from "@prisma/client";

export async function createNewColumn(data: { menuId: string, columnName: string}) {
    const table = await prisma.table.findUnique({
        where: { menuId: Number(data.menuId) }
    });
    
    if (!table) {
        return { success: false, error: 'Table not found' };
    }

    if ((table.columns as Prisma.JsonObject).length === 6) {
        return { success: false, error: 'Limit of columns reached' };
    }

    const newColumnKey = `column${(table.columns ? Object.keys(table.columns).length : 0) + 1}`;
    
    const updatedColumns = {
        ...(table.columns as Prisma.JsonObject),
        [newColumnKey]: data.columnName,
    };
    
    const tableWithColumnUpdated = await prisma.table.update({
        where: {
            menuId: Number(data.menuId),
        },
        data: {
            columns: updatedColumns,
        },
    });

    return { success: true, columns: tableWithColumnUpdated };
}