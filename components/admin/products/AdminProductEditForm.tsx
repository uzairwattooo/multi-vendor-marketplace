"use client";

import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ProductForEdit = {
    id: string;
    name: string;
    description: string;
    category: string;
    brand: string | null;
    sku: string;
    price: number;
    salePrice: number | null;
    lowStockThreshold: number;
};

type CategoryOption = {
    id: string;
    name: string;
};

type ProductUpdateInput = {
    action: "update";
    name: string;
    description: string;
    category: string;
    brand: string | null;
    sku: string;
    price: number;
    salePrice: number | null;
    lowStockThreshold: number;
};

async function updateProduct({
    productId,
    input,
}: {
    productId: string;
    input: ProductUpdateInput;
}) {
    const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to update product");
    }

    return data;
}

export default function AdminProductEditForm({
    product,
    categories,
}: {
    product: ProductForEdit;
    categories: CategoryOption[];
}) {
    const router = useRouter();
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [category, setCategory] = useState(product.category);
    const [brand, setBrand] = useState(product.brand ?? "");
    const [sku, setSku] = useState(product.sku);
    const [price, setPrice] = useState(String(product.price));
    const [salePrice, setSalePrice] = useState(
        product.salePrice === null ? "" : String(product.salePrice),
    );
    const [lowStockThreshold, setLowStockThreshold] = useState(
        String(product.lowStockThreshold),
    );

    const mutation = useMutation({
        mutationFn: updateProduct,
        onSuccess: (data) => {
            toast.success(data.message);
            router.push(`/admin/products/${product.id}`);
            router.refresh();
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to update product",
            );
        },
    });

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const numericPrice = Number(price);
        const numericSalePrice =
            salePrice.trim() === "" ? null : Number(salePrice);
        const numericThreshold = Number(lowStockThreshold);

        if (!Number.isInteger(numericPrice) || numericPrice < 0) {
            toast.error("Regular price must be a valid whole number");
            return;
        }

        if (
            numericSalePrice !== null &&
            (!Number.isInteger(numericSalePrice) ||
                numericSalePrice < 0 ||
                numericSalePrice >= numericPrice)
        ) {
            toast.error(
                "Sale price must be a whole number lower than regular price",
            );
            return;
        }

        if (!Number.isInteger(numericThreshold) || numericThreshold < 0) {
            toast.error("Low stock threshold must be a whole number");
            return;
        }

        mutation.mutate({
            productId: product.id,
            input: {
                action: "update",
                name: name.trim(),
                description: description.trim(),
                category,
                brand: brand.trim() || null,
                sku: sku.trim(),
                price: numericPrice,
                salePrice: numericSalePrice,
                lowStockThreshold: numericThreshold,
            },
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Link
                    href={`/admin/products/${product.id}`}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-fit rounded-xl",
                    )}
                >
                    <ArrowLeft className="size-4" />
                    Back to product
                </Link>

                <Button
                    type="submit"
                    className="rounded-xl"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Save className="size-4" />
                    )}
                    {mutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-6">
                    <section className="rounded-3xl border bg-card p-6 shadow-sm">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Product information
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Update customer-facing catalog content.
                            </p>
                        </div>

                        <div className="mt-6 space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="product-name">Product name</Label>
                                <Input
                                    id="product-name"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    minLength={2}
                                    maxLength={160}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="product-description">
                                    Description
                                </Label>
                                <Textarea
                                    id="product-description"
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(event.target.value)
                                    }
                                    rows={12}
                                    minLength={10}
                                    maxLength={10000}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    {description.length.toLocaleString()} / 10,000
                                    characters
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-3xl border bg-card p-6 shadow-sm">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Pricing
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Prices are stored as whole PKR amounts in the
                                current project schema.
                            </p>
                        </div>

                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="product-price">
                                    Regular price (PKR)
                                </Label>
                                <Input
                                    id="product-price"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={price}
                                    onChange={(event) =>
                                        setPrice(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="product-sale-price">
                                    Sale price (optional)
                                </Label>
                                <Input
                                    id="product-sale-price"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={salePrice}
                                    onChange={(event) =>
                                        setSalePrice(event.target.value)
                                    }
                                    placeholder="No sale price"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="rounded-3xl border bg-card p-6 shadow-sm">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Organization
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Keep filtering and seller records consistent.
                            </p>
                        </div>

                        <div className="mt-6 space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="product-category">
                                    Category
                                </Label>
                                <select
                                    id="product-category"
                                    value={category}
                                    onChange={(event) =>
                                        setCategory(event.target.value)
                                    }
                                    className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
                                    required
                                >
                                    {!categories.some(
                                        (item) => item.name === category,
                                    ) && (
                                        <option value={category}>
                                            {category} (current)
                                        </option>
                                    )}
                                    {categories.map((item) => (
                                        <option key={item.id} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="product-brand">Brand</Label>
                                <Input
                                    id="product-brand"
                                    value={brand}
                                    onChange={(event) =>
                                        setBrand(event.target.value)
                                    }
                                    maxLength={100}
                                    placeholder="Optional brand"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="product-sku">SKU</Label>
                                <Input
                                    id="product-sku"
                                    value={sku}
                                    onChange={(event) =>
                                        setSku(event.target.value)
                                    }
                                    minLength={2}
                                    maxLength={100}
                                    required
                                />
                                <p className="text-xs leading-5 text-muted-foreground">
                                    SKU must remain unique inside this product&apos;s
                                    store.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="product-threshold">
                                    Low stock threshold
                                </Label>
                                <Input
                                    id="product-threshold"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={lowStockThreshold}
                                    onChange={(event) =>
                                        setLowStockThreshold(event.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm leading-6 text-amber-900 dark:text-amber-200">
                        Stock quantity and reserved units are managed from the
                        Admin Inventory page so catalog editing cannot silently
                        overwrite live inventory.
                    </div>
                </div>
            </div>
        </form>
    );
}
