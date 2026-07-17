import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type CategoryCardProps = {
    name: string;
    slug: string;
    productCount: number;
    icon: LucideIcon;
};

export default function CategoryCard({
    name,
    slug,
    productCount,
    icon: Icon,
}: CategoryCardProps) {
    return (
        <Link
            href={`/products?category=${slug}`}
            className="group rounded-2xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-7" />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
                {name}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
                {productCount}{" "}
                {productCount === 1 ? "product" : "products"}
            </p>
        </Link>
    );
}