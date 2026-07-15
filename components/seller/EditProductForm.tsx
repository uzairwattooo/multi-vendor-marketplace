"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
    createProductSchema,
    type CreateProductInput,
} from "@/lib/validations/product";

import { updateProduct } from "@/services/product-service";

type Product = {
    id: string;
    name: string;
    description: string;
    category: string;
    sku: string;
    price: string;
    salePrice: string | null;
    stock: number;
    lowStockThreshold: number;
    status: "draft" | "active";
};

type Props = {
    product: Product;
};

export default function EditProductForm({
    product,
}: Props) {
    const router = useRouter();

    const form = useForm<CreateProductInput>({
        resolver: zodResolver(createProductSchema),

        defaultValues: {
            name: product.name,
            categoryId: product.category,
            description: product.description,
            price: Number(product.price),
            comparePrice: product.salePrice
                ? Number(product.salePrice)
                : undefined,
            sku: product.sku,
            quantity: product.stock,
            lowStockThreshold:
                product.lowStockThreshold,
            status: product.status,
            featured: false,
            images: [],
        },
    });

    const mutation = useMutation({
        mutationFn: (data: CreateProductInput) =>
            updateProduct(product.id, data),

        onSuccess: (data) => {
            toast.success(
                data.message ||
                "Product updated successfully"
            );

            router.push("/seller/products");

            router.refresh();
        },

        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to update product"
            );
        },
    });

    function onSubmit(
        values: CreateProductInput
    ) {
        mutation.mutate(values);
    }

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
        >
            <div className="rounded-xl border p-6">

                <h2 className="mb-6 text-xl font-semibold">
                    Basic Information
                </h2>

                <div className="grid gap-6 md:grid-cols-2">

                    <div>
                        <Label>
                            Product Name
                        </Label>

                        <Input
                            {...form.register("name")}
                        />

                        <p className="mt-1 text-sm text-red-500">
                            {
                                form.formState.errors.name
                                    ?.message
                            }
                        </p>
                    </div>

                    <div>
                        <Label>
                            SKU
                        </Label>

                        <Input
                            {...form.register("sku")}
                        />

                        <p className="mt-1 text-sm text-red-500">
                            {
                                form.formState.errors.sku
                                    ?.message
                            }
                        </p>
                    </div>

                    <div className="md:col-span-2">

                        <Label>
                            Description
                        </Label>

                        <Textarea
                            rows={6}
                            {...form.register(
                                "description"
                            )}
                        />

                    </div>

                </div>

            </div>
            <div className="rounded-xl border p-6">

                <h2 className="mb-6 text-xl font-semibold">
                    Pricing & Inventory
                </h2>

                <div className="grid gap-6 md:grid-cols-3">

                    <div>
                        <Label>Price</Label>

                        <Input
                            type="number"
                            {...form.register("price")}
                        />

                        <p className="mt-1 text-sm text-red-500">
                            {
                                form.formState.errors.price
                                    ?.message
                            }
                        </p>
                    </div>

                    <div>
                        <Label>Sale Price</Label>

                        <Input
                            type="number"
                            {...form.register("comparePrice")}
                        />

                        <p className="mt-1 text-sm text-red-500">
                            {
                                form.formState.errors.comparePrice
                                    ?.message
                            }
                        </p>
                    </div>

                    <div>
                        <Label>Status</Label>

                        <select
                            {...form.register("status")}
                            className="flex h-10 w-full rounded-md border px-3"
                        >
                            <option value="draft">
                                Draft
                            </option>

                            <option value="active">
                                Active
                            </option>
                        </select>
                    </div>

                    <div>
                        <Label>Stock</Label>

                        <Input
                            type="number"
                            {...form.register("quantity")}
                        />

                        <p className="mt-1 text-sm text-red-500">
                            {
                                form.formState.errors.quantity
                                    ?.message
                            }
                        </p>
                    </div>

                    <div>
                        <Label>
                            Low Stock Alert
                        </Label>

                        <Input
                            type="number"
                            {...form.register(
                                "lowStockThreshold"
                            )}
                        />

                        <p className="mt-1 text-sm text-red-500">
                            {
                                form.formState.errors
                                    .lowStockThreshold
                                    ?.message
                            }
                        </p>
                    </div>

                </div>

            </div>

            <div className="flex justify-end gap-4">

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={mutation.isPending}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Update Product
                        </>
                    )}
                </Button>

            </div>

        </form>
    );
}