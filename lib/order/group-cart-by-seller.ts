export type CartItemType = {
    cartItemId: string;
    quantity: number;
    productId: string;
    storeId: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
};

export function groupCartBySeller(
    items: CartItemType[],
) {
    const groups = new Map<string, CartItemType[]>();

    for (const item of items) {
        if (!groups.has(item.storeId)) {
            groups.set(item.storeId, []);
        }

        groups.get(item.storeId)!.push(item);
    }

    return Array.from(groups.entries()).map(
        ([storeId, items]) => ({
            storeId,
            items,
        }),
    );
}