import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Mail,
  ShoppingBag,
} from "lucide-react";

import Container from "@/components/common/Container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Newsletter() {
  return (
    <section className="pb-16 sm:pb-20">
      <Container>
        <div className="relative overflow-hidden rounded-[32px] bg-foreground px-7 py-12 text-background sm:px-10 lg:px-16 lg:py-16">
          <div className="absolute right-0 top-0 size-80 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 size-48 translate-y-1/2 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Mail className="size-5" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Marketplace updates
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                Discover new products and stores across the marketplace.
              </h2>

              <p className="mt-4 leading-7 text-background/65">
                Explore the latest products, save favourites and manage
                shopping from your buyer dashboard.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-background/70">
                <span className="inline-flex items-center gap-2">
                  <BellRing className="size-4 text-primary" />
                  Product updates
                </span>

                <span className="inline-flex items-center gap-2">
                  <ShoppingBag className="size-4 text-primary" />
                  New marketplace arrivals
                </span>
              </div>
            </div>

            <Link
              href="/products"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 shrink-0 gap-2 rounded-xl px-7",
              )}
            >
              Explore Products
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
