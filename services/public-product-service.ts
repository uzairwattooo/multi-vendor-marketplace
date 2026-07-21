export type PublicProduct = {
    id: string;
    name: string;
    slug: string;
    storeId: string;
    description: string | null;
    category: string;
    brand: string | null;
    price: string;
    salePrice: string | null;
    stock: number;
    storeName: string;
    storeSlug: string;
    image: string | null;
};

export type ProductsResponse = {
    products: PublicProduct[];

    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

type GetProductsParams = {
    search?: string;
    category?: string;
    sort?: string;
    page?: number;
};

export async function getPublicProducts({
    search = "",
    category = "all",
    sort = "newest",
    page = 1,
}: GetProductsParams): Promise<ProductsResponse> {
    const params = new URLSearchParams({
        search,
        category,
        sort,
        page: String(page),
    });

    const response = await fetch(`/api/products?${params.toString()}`, {
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to fetch products",
        );
    }

    return data;
}