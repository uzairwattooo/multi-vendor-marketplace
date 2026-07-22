"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Edit,
    Loader2,
    Package,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    deleteProduct,
    getProducts,
} from "@/services/product-service";
import { cn } from "@/lib/utils";

type Product = {
    id: string;
    name: string;
    sku: string;
    price: string;
    salePrice: string | null;
    stock: number;
    lowStockThreshold: number;
    status: "draft" | "active" | "archived";
};

export default function ProductsTable() {
    const queryClient = useQueryClient();
    const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    const {
        data: products = [],
        isLoading,
        isError,
        error,
    } = useQuery<Product[]>({
        queryKey: ["seller-products"],
        queryFn: getProducts,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,

        onSuccess: async (data) => {
            toast.success(
                data.message || "Product deleted successfully",
            );

            await queryClient.invalidateQueries({
                queryKey: ["seller-products"],
            });
        },

        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to delete product",
            );
        },
    });

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                product.sku
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                status === "all" || product.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [products, search, status]);

    if (isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <Loader2 className="size-7 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
                {error instanceof Error
                    ? error.message
                    : "Unable to load products"}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                        Product Management
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Products
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Manage your store products and inventory.
                    </p>
                </div>

                <Link
                    href="/seller/products/new"
                    className={cn(
                        buttonVariants({
                            size: "lg",
                        }),
                        "gap-2",
                    )}
                >
                    <Plus className="size-4" />
                    Add Product
                </Link>
            </div>

            <div className="grid gap-4 rounded-2xl border bg-card p-4 sm:grid-cols-[1fr_200px]">
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
                    value={status}
                    onChange={(event) =>
                        setStatus(event.target.value)
                    }
                    className="h-9 rounded-md border bg-background px-3 text-sm"
                >
                    <option value="all">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                </select>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="rounded-2xl border bg-card p-12 text-center">
                    <Package className="mx-auto size-12 text-muted-foreground" />

                    <h2 className="mt-4 text-lg font-semibold">
                        No products found
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Add a new product or change your search filters.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto hide-scrollbar  rounded-2xl border bg-card shadow-sm">
                    <table className="w-full min-w-[850px]">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-5 py-4 text-left text-sm">
                                    Product
                                </th>

                                <th className="px-5 py-4 text-left text-sm">
                                    SKU
                                </th>

                                <th className="px-5 py-4 text-left text-sm">
                                    Price
                                </th>

                                <th className="px-5 py-4 text-left text-sm">
                                    Stock
                                </th>

                                <th className="px-5 py-4 text-left text-sm">
                                    Status
                                </th>

                                <th className="px-5 py-4 text-right text-sm">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProducts.map((product) => {
                                const lowStock =
                                    product.stock <=
                                    product.lowStockThreshold;

                                return (
                                    <tr
                                        key={product.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-5 py-4 font-medium">
                                            {product.name}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-muted-foreground">
                                            {product.sku}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div>
                                                <span className="font-semibold">
                                                    Rs.{" "}
                                                    {product.salePrice ||
                                                        product.price}
                                                </span>

                                                {product.salePrice && (
                                                    <span className="ml-2 text-sm text-muted-foreground line-through">
                                                        Rs. {product.price}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={
                                                    lowStock
                                                        ? "font-semibold text-amber-600"
                                                        : ""
                                                }
                                            >
                                                {product.stock}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={cn(
                                                    "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                                                    product.status === "active" &&
                                                    "bg-emerald-100 text-emerald-700",
                                                    product.status === "draft" &&
                                                    "bg-amber-100 text-amber-700",
                                                    product.status === "archived" &&
                                                    "bg-zinc-100 text-zinc-700",
                                                )}
                                            >
                                                {product.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/seller/products/${product.id}/edit`}
                                                    className={buttonVariants({
                                                        variant: "outline",
                                                        size: "sm",
                                                    })}
                                                >
                                                    <Edit className="size-4" />
                                                    Edit
                                                </Link>

                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => setDeleteProductId(product.id)}
                                                >
                                                    <Trash2 className="size-4" />
                                                    Delete
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
            <AlertDialog
                open={Boolean(deleteProductId)}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteProductId(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete Product?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This action cannot be undone. The product will be permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={() => {
                                if (!deleteProductId) return;

                                deleteMutation.mutate(deleteProductId, {
                                    onSuccess: () => {
                                        setDeleteProductId(null);
                                    },
                                });
                            }}
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}