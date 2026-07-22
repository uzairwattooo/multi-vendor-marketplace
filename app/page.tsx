import {
  Baby,
  Boxes,
  Dumbbell,
  Headphones,
  Home,
  Laptop,
  Package,
  Shirt,
  type LucideIcon,
} from "lucide-react";
import {
  and,
  asc,
  count,
  desc,
  eq,
  isNotNull,
  lt,
  sql,
} from "drizzle-orm";

import { db } from "@/db";
import {
  category,
  product,
  productImage,
  store,
} from "@/db/schema";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import CategoryCard from "@/components/marketplace/CategoryCard";
import ProductCard from "@/components/marketplace/ProductCard";
import HeroSearch from "@/components/home/HeroSearch";
import Stats from "@/components/home/Stats";
import FlashSale from "@/components/home/FlashSale";
import TopStores from "@/components/home/TopStores";
import Newsletter from "@/components/home/Newsletter";

import type {
  MarketplaceProduct,
  MarketplaceStore,
} from "@/types/marketplace-home";

export const dynamic = "force-dynamic";

const categoryIconMap: Record<string, LucideIcon> = {
  electronics: Laptop,
  fashion: Shirt,
  "home-living": Home,
  home: Home,
  audio: Headphones,
  sports: Dumbbell,
  kids: Baby,
};

type HomeProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  brand: string | null;
  storeId: string;
  storeName: string;
  storeSlug: string;
  price: number;
  salePrice: number | null;
  stock: number;
  image: string | null;
};

function mapProduct(
  currentProduct: HomeProductRow,
  badge?: string,
): MarketplaceProduct {
  return {
    id: currentProduct.id,
    name: currentProduct.name,
    slug: currentProduct.slug,
    description: currentProduct.description,
    category: currentProduct.category,
    brand: currentProduct.brand ?? "",
    storeId: currentProduct.storeId,
    storeName: currentProduct.storeName,
    storeSlug: currentProduct.storeSlug,
    price: currentProduct.price,
    salePrice: currentProduct.salePrice,
    stock: currentProduct.stock,
    image: currentProduct.image,
    isWishlisted: false,
    badge,
  };
}

const productImageQuery = sql<string | null>`
  (
    SELECT ${productImage.url}
    FROM ${productImage}
    WHERE ${productImage.productId} = ${product.id}
    ORDER BY
      ${productImage.position} ASC,
      ${productImage.createdAt} ASC
    LIMIT 1
  )
`;

const productSelection = {
  id: product.id,
  name: product.name,
  slug: product.slug,
  description: product.description,
  category: product.category,
  brand: product.brand,
  storeId: store.id,
  storeName: store.name,
  storeSlug: store.slug,
  price: product.price,
  salePrice: product.salePrice,
  stock: product.stock,
  image: productImageQuery,
};

export default async function HomePage() {
  const [
    categoryRows,
    featuredProductRows,
    latestProductRows,
    saleProductRows,
    storeRows,
    productStatsResult,
    storeStatsResult,
    categoryStatsResult,
  ] = await Promise.all([
    db
      .select({
        id: category.id,
        name: category.name,
        slug: category.slug,
        productCount: count(store.id),
      })
      .from(category)
      .leftJoin(
        product,
        and(
          eq(product.category, category.name),
          eq(product.status, "active"),
        ),
      )
      .leftJoin(
        store,
        and(
          eq(product.storeId, store.id),
          eq(store.status, "approved"),
        ),
      )
      .groupBy(
        category.id,
        category.name,
        category.slug,
      )
      .orderBy(asc(category.name))
      .limit(12),

    db
      .select(productSelection)
      .from(product)
      .innerJoin(
        store,
        eq(product.storeId, store.id),
      )
      .where(
        and(
          eq(product.status, "active"),
          eq(product.featured, true),
          eq(store.status, "approved"),
        ),
      )
      .orderBy(desc(product.createdAt))
      .limit(8),

    db
      .select(productSelection)
      .from(product)
      .innerJoin(
        store,
        eq(product.storeId, store.id),
      )
      .where(
        and(
          eq(product.status, "active"),
          eq(store.status, "approved"),
        ),
      )
      .orderBy(desc(product.createdAt))
      .limit(8),

    db
      .select(productSelection)
      .from(product)
      .innerJoin(
        store,
        eq(product.storeId, store.id),
      )
      .where(
        and(
          eq(product.status, "active"),
          eq(store.status, "approved"),
          isNotNull(product.salePrice),
          lt(product.salePrice, product.price),
        ),
      )
      .orderBy(desc(product.createdAt))
      .limit(8),

    db
      .select({
        id: store.id,
        name: store.name,
        slug: store.slug,
        description: store.description,
        products: count(product.id),
      })
      .from(store)
      .leftJoin(
        product,
        and(
          eq(product.storeId, store.id),
          eq(product.status, "active"),
        ),
      )
      .where(eq(store.status, "approved"))
      .groupBy(
        store.id,
        store.name,
        store.slug,
        store.description,
      )
      .orderBy(desc(count(product.id)))
      .limit(4),

    db
      .select({
        total: count(),
      })
      .from(product)
      .innerJoin(
        store,
        eq(product.storeId, store.id),
      )
      .where(
        and(
          eq(product.status, "active"),
          eq(store.status, "approved"),
        ),
      ),

    db
      .select({
        total: count(),
      })
      .from(store)
      .where(eq(store.status, "approved")),

    db
      .select({
        total: count(),
      })
      .from(category),
  ]);

  const categories = categoryRows.map(
    (currentCategory) => ({
      name: currentCategory.name,
      slug: currentCategory.slug,
      productCount: Number(
        currentCategory.productCount,
      ),
      icon:
        categoryIconMap[
        currentCategory.slug.toLowerCase()
        ] ?? Package,
    }),
  );

  const featuredProducts = featuredProductRows.map(
    (currentProduct) =>
      mapProduct(currentProduct, "Featured"),
  );

  const latestProducts = latestProductRows.map(
    (currentProduct) =>
      mapProduct(currentProduct, "New"),
  );

  const saleProducts = saleProductRows.map(
    (currentProduct) =>
      mapProduct(currentProduct, "Flash Sale"),
  );

  const topStores: MarketplaceStore[] = storeRows.map(
    (currentStore) => ({
      name: currentStore.name,
      slug: currentStore.slug,
      description:
        currentStore.description ??
        "Marketplace Store",
      products: Number(currentStore.products),
      initials: currentStore.name
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    }),
  );

  const totalProducts = Number(
    productStatsResult[0]?.total ?? 0,
  );

  const totalStores = Number(
    storeStatsResult[0]?.total ?? 0,
  );

  const totalCategories = Number(
    categoryStatsResult[0]?.total ?? 0,
  );

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <HeroSearch
        totalProducts={totalProducts}
        totalStores={totalStores}
        totalCategories={totalCategories}
        popularCategories={categories}
      />

      <Stats
        totalProducts={totalProducts}
        totalStores={totalStores}
        totalCategories={totalCategories}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Shop by category"
            title="Browse popular categories"
            description="Find products quickly by exploring marketplace categories."
            href="/categories"
            linkText="View all categories"
          />

          {categories.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {categories.map(
                (currentCategory) => (
                  <CategoryCard
                    key={currentCategory.slug}
                    {...currentCategory}
                  />
                ),
              )}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-dashed bg-card p-12 text-center">
              <Boxes className="mx-auto size-10 text-muted-foreground" />
              <p className="mt-4 font-semibold">
                No categories available
              </p>
            </div>
          )}
        </Container>
      </section>

      <FlashSale products={saleProducts} />

      <section className="border-y bg-card py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Featured products"
            title="Handpicked products for you"
            description="Explore featured products from approved marketplace sellers."
            href="/products?featured=true"
            linkText="View all products"
          />

          {featuredProducts.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map(
                (currentProduct) => (
                  <ProductCard
                    key={currentProduct.id}
                    {...currentProduct}
                  />
                ),
              )}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-dashed bg-background p-12 text-center">
              <Package className="mx-auto size-10 text-muted-foreground" />
              <p className="mt-4 font-semibold">
                No featured products yet
              </p>
            </div>
          )}
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="New arrivals"
            title="Fresh products in the marketplace"
            description="Discover the latest products recently added by marketplace sellers."
            href="/products?sort=newest"
            linkText="Explore new products"
          />

          {latestProducts.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {latestProducts.map(
                (currentProduct) => (
                  <ProductCard
                    key={currentProduct.id}
                    {...currentProduct}
                  />
                ),
              )}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-dashed bg-card p-12 text-center">
              <Package className="mx-auto size-10 text-muted-foreground" />
              <p className="mt-4 font-semibold">
                No products available
              </p>
            </div>
          )}
        </Container>
      </section>

      <TopStores stores={topStores} />

      <Newsletter />

      <Footer />
    </main>
  );
}
