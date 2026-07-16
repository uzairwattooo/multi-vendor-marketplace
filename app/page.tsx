import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  PackageCheck,
  ShieldCheck,
  Store,
} from "lucide-react";
import { db } from "@/db";
import Footer from "@/components/common/Footer";
import Container from "@/components/common/Container";
import Navbar from "@/components/common/Navbar";
import SectionHeading from "@/components/common/SectionHeading";
import CategoryCard from "@/components/marketplace/CategoryCard";
import ProductCard from "@/components/marketplace/ProductCard";
import { buttonVariants } from "@/components/ui/button";
import StoreCard from "@/components/marketplace/StoreCard";
import {
  Baby,
  Dumbbell,
  Headphones,
  Home,
  Laptop,
  Package,
  Shirt,
  type LucideIcon,
} from "lucide-react";
import { and, desc, eq, sql, asc } from "drizzle-orm";
import {
  category,
  product,
  productImage,
  store,
} from "@/db/schema";
import { cn } from "@/lib/utils";

const stats = [
  { value: "10K+", label: "Products" },
  { value: "2K+", label: "Trusted Sellers" },
  { value: "25K+", label: "Happy Buyers" },
];

const features = [
  {
    icon: Store,
    title: "Trusted Stores",
    description:
      "Verified sellers aur trusted stores sy confidently shopping kro.",
  },
  {
    icon: PackageCheck,
    title: "Easy Orders",
    description:
      "Simple checkout, order tracking aur complete order management.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    description:
      "Secure payments, buyer protection aur transparent reviews.",
  },
];

const categoryIconMap: Record<string, LucideIcon> = {
  electronics: Laptop,
  fashion: Shirt,
  "home-living": Home,
  audio: Headphones,
  sports: Dumbbell,
  kids: Baby,
};
export default async function HomePage() {
  let categoryRows: {
    id: string;
    name: string;
    slug: string;
  }[] = [];

  try {
    categoryRows = await db
      .select({
        id: category.id,
        name: category.name,
        slug: category.slug,
      })
      .from(category)
      .orderBy(asc(category.name));
  } catch (error) {
    console.error("CATEGORY_QUERY_ERROR:", error);
  }
  const categories = categoryRows.map((currentCategory) => ({
    name: currentCategory.name,
    slug: currentCategory.slug,
    productCount: 0,
    icon:
      categoryIconMap[currentCategory.slug.toLowerCase()] ??
      Package,
  }));

  type HomeProductRow = {
    id: string;
    name: string;
    slug: string;
    storeId: string;
    storeName: string;
    price: string;
    salePrice: string | null;
    stock: number;
    image: string | null;
  };

  const productRows: HomeProductRow[] = await db
    .select({
      id: product.id,
      name: product.name,
      slug: product.slug,
      storeId: store.id,
      storeName: store.name,
      price: product.price,
      salePrice: product.salePrice,
      stock: product.stock,

      image: sql<string | null>`
            (
                SELECT ${productImage.url}
                FROM ${productImage}
                WHERE ${productImage.productId} = ${product.id}
                ORDER BY ${productImage.createdAt} ASC
                LIMIT 1
            )
        `,
    })
    .from(product)
    .innerJoin(store, eq(product.storeId, store.id))
    .where(
      and(
        eq(product.status, "active"),
        eq(product.featured, true),
        eq(store.status, "approved"),
      ),
    )
    .orderBy(desc(product.createdAt))
    .limit(8);
  type HomeFeaturedProduct = {
    id: string;
    name: string;
    slug: string;
    storeId: string;
    storeName: string;
    price: number;
    salePrice: number | null;
    stock: number;
    image: string | null;
    rating: number;
    reviewCount: number;
    badge?: string;
  };

  const featuredProducts: HomeFeaturedProduct[] =
    productRows.map((currentProduct) => ({
      id: currentProduct.id,
      name: currentProduct.name,
      slug: currentProduct.slug,
      storeId: currentProduct.storeId,
      storeName: currentProduct.storeName,
      price: Number(currentProduct.price),

      salePrice: currentProduct.salePrice
        ? Number(currentProduct.salePrice)
        : null,

      stock: currentProduct.stock,
      image: currentProduct.image,
      rating: 0,
      reviewCount: 0,

      badge: currentProduct.salePrice
        ? "Sale"
        : undefined,
    }));

  const storeRows = await db
    .select({
      id: store.id,
      name: store.name,
      slug: store.slug,
      description: store.description,
    })
    .from(store)
    .where(eq(store.status, "approved"))
    .orderBy(desc(store.createdAt))
    .limit(4);

  const topStores = storeRows.map((currentStore) => ({
    name: currentStore.name,
    slug: currentStore.slug,
    category:
      currentStore.description || "Marketplace Store",
    rating: 0,
    reviews: 0,
    products: 0,
    initials: currentStore.name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase(),
  }));
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(124,58,237,0.14),_transparent_35%)]" />

        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium shadow-sm">
                <BadgeCheck className="size-4 text-primary" />
                Trusted multi-vendor marketplace
              </div>

              <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Discover unique products from{" "}
                <span className="text-primary">trusted sellers</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                Products explore kro, apni favourite stores sy shopping kro ya
                apna store bana kar online selling start kro.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "gap-2"
                  )}
                >
                  Explore Products
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  href="/seller/onboarding"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                  })}
                >
                  Start Selling
                </Link>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
                {stats.map((item) => (
                  <div key={item.label}>
                    <h3 className="text-2xl font-bold sm:text-3xl">
                      {item.value}
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[32px] border bg-card p-4 shadow-xl">
                <div className="rounded-[24px] bg-gradient-to-br from-primary/15 via-background to-primary/5 p-6 sm:p-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4 pt-10">
                      <div className="rounded-2xl border bg-card p-4 shadow-sm">
                        <div className="h-32 rounded-xl bg-muted" />
                        <div className="mt-4 h-4 w-3/4 rounded bg-muted" />
                        <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
                      </div>

                      <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
                        <p className="text-sm opacity-80">
                          Seller earnings
                        </p>

                        <h3 className="mt-2 text-3xl font-bold">
                          Rs. 125K
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border bg-card p-4 shadow-sm">
                        <div className="h-40 rounded-xl bg-muted" />

                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <div className="h-4 w-24 rounded bg-muted" />
                            <div className="mt-2 h-4 w-16 rounded bg-muted" />
                          </div>

                          <div className="size-10 rounded-full bg-primary/10" />
                        </div>
                      </div>

                      <div className="rounded-2xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                          Active stores
                        </p>

                        <h3 className="mt-2 text-3xl font-bold">
                          2,340
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className="border-y bg-card py-14">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border bg-background p-6 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Top sellers"
            title="Shop from trusted stores"
            description="Highly-rated aur verified sellers ke stores explore kro."
            href="/stores"
            linkText="Explore all stores"
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {topStores.map((currentStore) => (
              <StoreCard
                key={currentStore.slug}
                {...currentStore}
              />
            ))}
          </div>
        </Container>
      </section>
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Shop by category"
            title="Explore popular categories"
            description="Apni pasand ki category choose kro aur trusted sellers ke products explore kro."
            href="/categories"
          />

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((currentCategory) => (
              <CategoryCard
                key={currentCategory.slug}
                {...currentCategory}
              />
            ))}
          </div>
        </Container>
      </section>
      <section className="border-y bg-card py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Featured products"
            title="Products you may love"
            description="Marketplace ke trending aur highly-rated products check kro."
            href="/products"
            linkText="Explore all products"
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                storeId={product.storeId}
                storeName={product.storeName}
                price={product.price}
                salePrice={product.salePrice}
                stock={product.stock}
                image={product.image}
                rating={product.rating}
                reviewCount={product.reviewCount}
                badge={product.badge}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="relative overflow-hidden rounded-[28px] bg-primary px-6 py-12 text-primary-foreground sm:px-10 lg:px-16 lg:py-16">
            <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-24 right-32 size-72 rounded-full bg-white/5" />

            <div className="relative z-10 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/75">
                Start your business
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Apna online store banao aur selling start kro
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-primary-foreground/80">
                Products add kro, inventory manage kro, orders receive kro aur
                apni sales analytics aik hi dashboard se dekho.
              </p>

              <Link
                href="/seller/onboarding"
                className={cn(
                  buttonVariants({
                    variant: "secondary",
                    size: "lg",
                  }),
                  "mt-8 gap-2"
                )}
              >
                Create Your Store
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
      <Footer />
    </main>
  );
}