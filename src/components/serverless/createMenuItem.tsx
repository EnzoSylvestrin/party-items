import prisma from "@/lib/prisma";

export async function createMenuItem(menuId: any, item: { name: any; quantity: any; price: any; }) {

    const createdItem = await prisma.item.create({
        data: {
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            menuId: parseInt(menuId, 10),
        },
    });

    return createdItem;
}