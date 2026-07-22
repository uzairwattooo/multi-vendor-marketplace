import type { LucideIcon } from "lucide-react";

export type MarketplaceProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  brand: string;
  storeId: string;
  storeName: string;
  storeSlug: string;
  price: number;
  salePrice: number | null;
  stock: number;
  image: string | null;
  isWishlisted?: boolean;
  badge?: string;
};

export type MarketplaceStore = {
  name: string;
  slug: string;
  description: string;
  products: number;
  initials: string;
};

export type MarketplaceCategory = {
  name: string;
  slug: string;
  productCount: number;
  icon: LucideIcon;
};
