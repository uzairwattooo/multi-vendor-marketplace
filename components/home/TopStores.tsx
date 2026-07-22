import { Store as StoreIcon } from "lucide-react";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import StoreCard from "@/components/marketplace/StoreCard";
import type { MarketplaceStore } from "@/types/marketplace-home";

type TopStoresProps = {
  stores: MarketplaceStore[];
};

export default function TopStores({
  stores,
}: TopStoresProps) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Top stores"
          title="Shop from trusted sellers"
          description="Explore approved stores with the largest active product collections."
          href="/stores"
          linkText="Explore all stores"
        />

        {stores.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stores.map((currentStore) => (
              <StoreCard
                key={currentStore.slug}
                {...currentStore}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed bg-card p-12 text-center">
            <StoreIcon className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-4 font-semibold">
              No approved stores available
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
