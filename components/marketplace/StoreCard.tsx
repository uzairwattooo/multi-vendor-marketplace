import Link from "next/link";
import { BadgeCheck, Package, Star } from "lucide-react";

type StoreCardProps = {
    name: string;
    slug: string;
    category: string;
    rating: number;
    reviews: number;
    products: number;
    initials: string;
};

export default function StoreCard({
    name,
    slug,
    category,
    rating,
    reviews,
    products,
    initials,
}: StoreCardProps) {
    return (
        <Link
            href={`/stores/${slug}`}
            className="group rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
        >
            <div className="flex items-start justify-between">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">
                    {initials}
                </div>

                <BadgeCheck className="size-5 text-primary" />
            </div>

            <h3 className="mt-5 text-lg font-semibold transition group-hover:text-primary">
                {name}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
                {category}
            </p>

            <div className="mt-5 flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-1">
                    <Star className="size-4 fill-amber-400 text-amber-400" />

                    <span className="text-sm font-semibold">
                        {rating}
                    </span>

                    <span className="text-xs text-muted-foreground">
                        ({reviews})
                    </span>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Package className="size-4" />
                    {products} Products
                </div>
            </div>
        </Link>
    );
}