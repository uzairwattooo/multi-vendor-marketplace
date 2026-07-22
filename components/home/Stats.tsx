import {
  Boxes,
  CreditCard,
  Layers3,
  Store,
} from "lucide-react";

import Container from "@/components/common/Container";

type StatsProps = {
  totalProducts: number;
  totalStores: number;
  totalCategories: number;
};

export default function Stats({
  totalProducts,
  totalStores,
  totalCategories,
}: StatsProps) {
  const items = [
    {
      icon: Boxes,
      value: totalProducts.toLocaleString(),
      label: "Active Products",
      description: "Available from approved stores",
    },
    {
      icon: Store,
      value: totalStores.toLocaleString(),
      label: "Approved Stores",
      description: "Verified marketplace sellers",
    },
    {
      icon: Layers3,
      value: totalCategories.toLocaleString(),
      label: "Categories",
      description: "Easy ways to browse products",
    },
    {
      icon: CreditCard,
      value: "2",
      label: "Payment Options",
      description: "Stripe and Cash on Delivery",
    },
  ];

  return (
    <section className="border-b bg-card">
      <Container>
        <div className="grid divide-y md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-4 px-4 py-7 first:pl-0 last:pr-0 md:px-6"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>

                <div>
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
