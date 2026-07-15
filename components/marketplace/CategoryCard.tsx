import Link from "next/link";
import {
    Baby,
    BookOpen,
    Dumbbell,
    Gamepad2,
    Headphones,
    House,
    Laptop,
    Package,
    Shirt,
    ShoppingBag,
    Smartphone,
    Sparkles,
    type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    electronics: Laptop,
    mobile: Smartphone,
    mobiles: Smartphone,
    fashion: Shirt,
    beauty: Sparkles,
    home: House,
    gaming: Gamepad2,
    books: BookOpen,
    sports: Dumbbell,
    audio: Headphones,
    kids: Baby,
    shopping: ShoppingBag,
};

type CategoryCardProps = {
    name: string;
    slug: string;
};

export default function CategoryCard({
    name,
    slug,
}: CategoryCardProps) {
    const safeSlug = slug?.toLowerCase().trim() || "other";
    const Icon = iconMap[safeSlug] || Package;

    return (
        <Link
            href={`/products?category=${safeSlug}`}
            className="group rounded-2xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-7" />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
                {name || "Category"}
            </h3>
        </Link>
    );
}