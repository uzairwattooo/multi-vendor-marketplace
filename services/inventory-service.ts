export type InventoryProduct = {
    id: string;
    name: string;
    sku: string;
    stock: number;
    lowStockThreshold: number;
    status: string;
    price: string;
    updatedAt: string;
};

type GetInventoryParams = {
    search?: string;
    status?: string;
};

export async function getInventory({
    search = "",
    status = "all",
}: GetInventoryParams): Promise<InventoryProduct[]> {
    const params = new URLSearchParams();

    if (search) {
        params.set("search", search);
    }

    if (status !== "all") {
        params.set("status", status);
    }

    const query = params.toString();

    const response = await fetch(
        `/api/seller/inventory${query ? `?${query}` : ""}`,
        {
            method: "GET",
            cache: "no-store",
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error ||
            data.message ||
            "Unable to fetch inventory",
        );
    }

    return data;
}

type UpdateInventoryInput = {
    productId: string;
    stock: number;
    lowStockThreshold: number;
};

export async function updateInventory({
    productId,
    stock,
    lowStockThreshold,
}: UpdateInventoryInput) {
    const response = await fetch(
        `/api/seller/inventory/${productId}`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                stock,
                lowStockThreshold,
            }),
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to update inventory",
        );
    }

    return data;
}