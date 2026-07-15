"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Controller } from "react-hook-form";

import ProductImageUploader from "@/components/seller/ProductImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    createProductSchema,
    type CreateProductInput,
} from "@/lib/validations/product";
import { createProduct } from "@/services/product-service";

type Category = {
    id: string;
    name: string;
};

type ProductFormProps = {
    categories: Category[];
};

export default function ProductForm({
    categories,
}: ProductFormProps) {
    const router = useRouter();

    const form = useForm<CreateProductInput>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: "",
            categoryId: "",
            description: "",
            price: 0,
            comparePrice: undefined,
            sku: "",
            quantity: 0,
            lowStockThreshold: 5,
            status: "draft",
            featured: false,
            images: [],
        },
    });

    const mutation = useMutation({
        mutationFn: createProduct,

        onSuccess: (data) => {
            toast.success(
                data.message || "Product created successfully",
            );

            router.push("/seller/products");
            router.refresh();
        },

        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to create product",
            );
        },
    });

    function handleSubmit(values: CreateProductInput) {
        mutation.mutate(values);
    }

    return (
        <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
        >
            <section className="rounded-2xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">
                    Basic Information
                </h2>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <FormField
                        label="Product Name"
                        htmlFor="name"
                        error={form.formState.errors.name?.message}
                    >
                        <Input
                            id="name"
                            placeholder="Enter product name"
                            {...form.register("name")}
                        />
                    </FormField>

                    <FormField
                        label="Category"
                        htmlFor="categoryId"
                        error={
                            form.formState.errors.categoryId?.message
                        }
                    >
                        <select
                            id="categoryId"
                            {...form.register("categoryId")}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                        >
                            <option value="">
                                Select category
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <div className="md:col-span-2">
                        <FormField
                            label="Description"
                            htmlFor="description"
                            error={
                                form.formState.errors.description?.message
                            }
                        >
                            <Textarea
                                id="description"
                                rows={6}
                                placeholder="Enter product description"
                                {...form.register("description")}
                            />
                        </FormField>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">
                    Pricing & Inventory
                </h2>

                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <FormField
                        label="Price"
                        htmlFor="price"
                        error={form.formState.errors.price?.message}
                    >
                        <Input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="4500"
                            {...form.register("price")}
                        />
                    </FormField>

                    <FormField
                        label="Sale Price"
                        htmlFor="comparePrice"
                        error={
                            form.formState.errors.comparePrice?.message
                        }
                    >
                        <Input
                            id="comparePrice"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="4000"
                            {...form.register("comparePrice")}
                        />
                    </FormField>

                    <FormField
                        label="SKU"
                        htmlFor="sku"
                        error={form.formState.errors.sku?.message}
                    >
                        <Input
                            id="sku"
                            placeholder="HEADPHONE-001"
                            {...form.register("sku")}
                        />
                    </FormField>

                    <FormField
                        label="Stock Quantity"
                        htmlFor="quantity"
                        error={
                            form.formState.errors.quantity?.message
                        }
                    >
                        <Input
                            id="quantity"
                            type="number"
                            min="0"
                            {...form.register("quantity")}
                        />
                    </FormField>

                    <FormField
                        label="Low Stock Alert"
                        htmlFor="lowStockThreshold"
                        error={
                            form.formState.errors.lowStockThreshold
                                ?.message
                        }
                    >
                        <Input
                            id="lowStockThreshold"
                            type="number"
                            min="0"
                            {...form.register("lowStockThreshold")}
                        />
                    </FormField>

                    <FormField
                        label="Status"
                        htmlFor="status"
                        error={form.formState.errors.status?.message}
                    >
                        <select
                            id="status"
                            {...form.register("status")}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                        >
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                        </select>
                    </FormField>
                </div>
            </section>
            <Controller
                name="images"
                control={form.control}
                render={({ field }) => (
                    <ProductImageUploader
                        value={field.value || []}
                        onChange={field.onChange}
                    />
                )}
            />
            <section className="rounded-2xl border bg-card p-6 shadow-sm">
                <label className="flex cursor-pointer items-center gap-3">
                    <input
                        type="checkbox"
                        {...form.register("featured")}
                        className="size-4"
                    />

                    <div>
                        <p className="font-medium">
                            Featured Product
                        </p>

                        <p className="text-sm text-muted-foreground">
                            Show this product in featured sections.
                        </p>
                    </div>
                </label>
            </section>


            <div className="flex justify-end gap-3">
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
                    className="min-w-40"
                >
                    {mutation.isPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="size-4" />
                            Save Product
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}

type FormFieldProps = {
    label: string;
    htmlFor: string;
    error?: string;
    children: React.ReactNode;
};

function FormField({
    label,
    htmlFor,
    error,
    children,
}: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={htmlFor}>
                {label}
            </Label>

            {children}

            {error && (
                <p className="text-sm text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}