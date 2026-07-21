export type MarketplaceProduct = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    category: string;
    brand: string | null;
    price: number;
    salePrice: number | null;
    stock: number;
    image: string | null;
    storeId: string;
    storeName: string;
    storeSlug: string;
    rating: number;
    reviewCount: number;
    isWishlisted: boolean;
};