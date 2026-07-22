"use client";

import {AlertTriangle,Boxes,CheckCircle2,Loader2,PackageX,Search,Save,} from "lucide-react";
import {useMutation,useQuery,useQueryClient,} from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {getInventory,type InventoryProduct,updateInventory,} from "@/services/inventory-service";


type InventoryDraft = {
    stock: string;
    lowStockThreshold: string;
};

export default function InventoryTable() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [drafts, setDrafts] = useState<Record<string, InventoryDraft>>({});
    const {
        data: products = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["seller-inventory", search, filter],

        queryFn: () =>
            getInventory({
                search,
                status: filter,
            }),
    });

    const updateMutation = useMutation({
        mutationFn: updateInventory,

        onSuccess: async (data) => {
            toast.success(
                data.message || "Inventory updated successfully",
            );

            await queryClient.invalidateQueries({
                queryKey: ["seller-inventory"],
            });

            await queryClient.invalidateQueries({
                queryKey: ["seller-products"],
            });
        },

        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to update inventory",
            );
        },
    });

    const stats = useMemo(() => {
        const total = products.length;

        const inStock = products.filter(
            (item) => item.stock > item.lowStockThreshold,
        ).length;

        const lowStock = products.filter(
            (item) =>
                item.stock > 0 &&
                item.stock <= item.lowStockThreshold,
        ).length;

        const outOfStock = products.filter(
            (item) => item.stock === 0,
        ).length;

        return {
            total,
            inStock,
            lowStock,
            outOfStock,
        };
    }, [products]);

    function getDraft(product: InventoryProduct) {
        return (
            drafts[product.id] ?? {
                stock: String(product.stock),
                lowStockThreshold: String(
                    product.lowStockThreshold,
                ),
            }
        );
    }

    function updateDraft(
        productId: string,
        field: keyof InventoryDraft,
        value: string,
    ) {
        setDrafts((current) => ({
            ...current,

            [productId]: {
                ...(current[productId] ?? {
                    stock: "",
                    lowStockThreshold: "",
                }),

                [field]: value,
            },
        }));
    }

    function handleSave(product: InventoryProduct) {
        const draft = getDraft(product);

        const stock = Number(draft.stock);
        const lowStockThreshold = Number(
            draft.lowStockThreshold,
        );

        if (
            !Number.isInteger(stock) ||
            stock < 0
        ) {
            toast.error(
                "Stock must be a valid whole number",
            );
            return;
        }

        if (
            !Number.isInteger(lowStockThreshold) ||
            lowStockThreshold < 0
        ) {
            toast.error(
                "Low stock threshold must be a valid whole number",
            );
            return;
        }

        updateMutation.mutate({
            productId: product.id,
            stock,
            lowStockThreshold,
        });
    }

    if (isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
                {error instanceof Error
                    ? error.message
                    : "Unable to load inventory"}
            </div>
        );
    }

    return (
        <div className="space-y-7">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    Inventory Management
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    Inventory
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Manage stock levels and low-stock alerts.
                </p>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <InventoryStat
                    title="Total Products"
                    value={stats.total}
                    icon={Boxes}
                />

                <InventoryStat
                    title="In Stock"
                    value={stats.inStock}
                    icon={CheckCircle2}
                />

                <InventoryStat
                    title="Low Stock"
                    value={stats.lowStock}
                    icon={AlertTriangle}
                />

                <InventoryStat
                    title="Out of Stock"
                    value={stats.outOfStock}
                    icon={PackageX}
                />
            </section>

            <section className="grid gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:grid-cols-[1fr_220px]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search by product name or SKU"
                        className="pl-9"
                    />
                </div>

                <select
                    value={filter}
                    onChange={(event) =>
                        setFilter(event.target.value)
                    }
                    className="h-9 rounded-md border bg-background px-3 text-sm outline-none"
                >
                    <option value="all">All Products</option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">
                        Out of Stock
                    </option>
                </select>
            </section>

            {products.length === 0 ? (
                <div className="rounded-2xl border bg-card p-12 text-center shadow-sm">
                    <Boxes className="mx-auto size-12 text-muted-foreground" />

                    <h2 className="mt-4 text-lg font-semibold">
                        No inventory found
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Products matching your filters will appear here.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto hide-scrollbar  rounded-2xl border bg-card shadow-sm">
                    <table className="w-full min-w-[900px]">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-5 py-4 text-left text-sm">
                                    Product
                                </th>

                                <th className="px-5 py-4 text-left text-sm">
                                    SKU
                                </th>

                                <th className="px-5 py-4 text-left text-sm">
                                    Stock
                                </th>

                                <th className="px-5 py-4 text-left text-sm">
                                    Low Stock Alert
                                </th>

                                <th className="px-5 py-4 text-left text-sm">
                                    Inventory Status
                                </th>

                                <th className="px-5 py-4 text-right text-sm">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((currentProduct) => {
                                const draft = getDraft(currentProduct);

                                const isSaving =
                                    updateMutation.isPending &&
                                    updateMutation.variables?.productId ===
                                    currentProduct.id;

                                return (
                                    <tr
                                        key={currentProduct.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="font-semibold">
                                                {currentProduct.name}
                                            </p>

                                            <p className="mt-1 text-xs capitalize text-muted-foreground">
                                                {currentProduct.status}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-muted-foreground">
                                            {currentProduct.sku}
                                        </td>

                                        <td className="px-5 py-4">
                                            <Input
                                                type="number"
                                                min="0"
                                                value={draft.stock}
                                                onChange={(event) =>
                                                    updateDraft(
                                                        currentProduct.id,
                                                        "stock",
                                                        event.target.value,
                                                    )
                                                }
                                                className="w-28"
                                            />
                                        </td>

                                        <td className="px-5 py-4">
                                            <Input
                                                type="number"
                                                min="0"
                                                value={draft.lowStockThreshold}
                                                onChange={(event) =>
                                                    updateDraft(
                                                        currentProduct.id,
                                                        "lowStockThreshold",
                                                        event.target.value,
                                                    )
                                                }
                                                className="w-28"
                                            />
                                        </td>

                                        <td className="px-5 py-4">
                                            <InventoryBadge
                                                stock={currentProduct.stock}
                                                lowStockThreshold={
                                                    currentProduct.lowStockThreshold
                                                }
                                            />
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleSave(currentProduct)
                                                    }
                                                    disabled={updateMutation.isPending}
                                                >
                                                    {isSaving ? (
                                                        <>
                                                            <Loader2 className="size-4 animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="size-4" />
                                                            Save
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

type InventoryStatProps = {
    title: string;
    value: number;
    icon: React.ElementType;
};

function InventoryStat({
    title,
    value,
    icon: Icon,
}: InventoryStatProps) {
    return (
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {value}
                    </h2>
                </div>

                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                </div>
            </div>
        </div>
    );
}

type InventoryBadgeProps = {
    stock: number;
    lowStockThreshold: number;
};

function InventoryBadge({
    stock,
    lowStockThreshold,
}: InventoryBadgeProps) {
    if (stock === 0) {
        return (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                Out of Stock
            </span>
        );
    }

    if (stock <= lowStockThreshold) {
        return (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                Low Stock
            </span>
        );
    }

    return (
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            In Stock
        </span>
    );
}