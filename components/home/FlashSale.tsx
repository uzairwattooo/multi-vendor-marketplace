import { Flame, TimerReset } from "lucide-react";

import Container from "@/components/common/Container";
import ProductCard from "@/components/marketplace/ProductCard";
import type { MarketplaceProduct } from "@/types/marketplace-home";

type FlashSaleProps = {
  products: MarketplaceProduct[];
};

export default function FlashSale({
  products,
}: FlashSaleProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="border-y bg-card py-16 sm:py-20">
      <Container>
        <div className="overflow-hidden rounded-[32px] border bg-gradient-to-br from-orange-500/10 via-background to-primary/10 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600">
                  <Flame className="size-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                    Flash sale
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Limited-price deals
                  </h2>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
                Products with a sale price lower than the regular price
                automatically appear in this section.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-card px-4 py-2 text-xs font-medium text-muted-foreground">
              <TimerReset className="size-4 text-orange-600" />
              Live marketplace offers
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
