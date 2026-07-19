export function groupCartBySeller(items: any[]) {
    const groups = new Map();

    for (const item of items) {
        if (!groups.has(item.storeId)) {
            groups.set(item.storeId, []);
        }

        groups.get(item.storeId).push(item);
    }

    return Array.from(groups.entries()).map(
        ([storeId, items]) => ({
            storeId,
            items,
        }),
    );
}

export type CartItemType = {
    productId: string;
    storeId: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    stock: number;
};