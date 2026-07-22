import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";

import Container from "@/components/common/Container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeroSearchProps = {
  totalProducts: number;
  totalStores: number;
  totalCategories: number;
  popularCategories: Array<{
    name: string;
    slug: string;
  }>;
};

export default function HeroSearch({
  totalProducts,
  totalStores,
  totalCategories,
  popularCategories,
}: HeroSearchProps) {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 -z-20 bg-background" />
      <div className="absolute left-0 top-0 -z-10 size-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute right-0 top-0 -z-10 size-[520px] translate-x-1/3 rounded-full bg-violet-500/10 blur-3xl" />

      <Container>
        <div className="grid min-h-[640px] items-center gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-sm backdrop-blur">
              <BadgeCheck className="size-4" />
              Trusted multi-vendor marketplace
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Shop better from{" "}
              <span className="text-primary">
                verified marketplace stores.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Discover products from approved sellers, save your favourites,
              manage your cart and place secure orders from one marketplace.
            </p>

            <form
              action="/products"
              method="get"
              className="mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border bg-card p-2 shadow-xl shadow-black/5 sm:flex-row"
            >
              <div className="flex flex-1 items-center gap-3 px-3">
                <Search className="size-5 shrink-0 text-muted-foreground" />

                <input
                  type="search"
                  name="search"
                  placeholder="Search products, categories or stores..."
                  className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>

              <button
                type="submit"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 rounded-xl px-7",
                )}
              >
                Search
              </button>
            </form>

            {popularCategories.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Popular:
                </span>

                {popularCategories.slice(0, 4).map((item) => (
                  <Link
                    key={item.slug}
                    href={`/products?category=${encodeURIComponent(item.name)}`}
                    className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 gap-2 rounded-xl px-7",
                )}
              >
                Explore Products
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/seller/onboarding"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "lg",
                  }),
                  "h-12 gap-2 rounded-xl px-7",
                )}
              >
                <Store className="size-4" />
                Open Your Store
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="rounded-[36px] border bg-card p-3 shadow-2xl shadow-black/10">
              <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-primary/15 via-background to-violet-500/10 p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      Marketplace
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                      Shop with confidence
                    </h2>
                  </div>

                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                    <ShoppingBag className="size-5" />
                  </div>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border bg-card/85 p-4 backdrop-blur">
                    <ShieldCheck className="size-5 text-primary" />
                    <p className="mt-4 text-sm font-semibold">
                      Secure Payments
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Stripe and Cash on Delivery.
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-card/85 p-4 backdrop-blur">
                    <BadgeCheck className="size-5 text-primary" />
                    <p className="mt-4 text-sm font-semibold">
                      Verified Stores
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Approved marketplace sellers.
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-card/85 p-4 backdrop-blur">
                    <Truck className="size-5 text-primary" />
                    <p className="mt-4 text-sm font-semibold">
                      Order Tracking
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Follow every order status.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { label: "Products", value: totalProducts },
                    { label: "Stores", value: totalStores },
                    { label: "Categories", value: totalCategories },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border bg-card/85 p-4 backdrop-blur"
                    >
                      <p className="text-xl font-bold">
                        {item.value.toLocaleString()}
                      </p>

                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
