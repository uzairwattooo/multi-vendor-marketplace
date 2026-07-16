"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/providers/CartProvider";

const checkoutSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, "Full name is required"),

    phone: z
        .string()
        .trim()
        .regex(
            /^(\+92|0)?3\d{9}$/,
            "Enter a valid Pakistani phone number",
        ),

    address: z
        .string()
        .trim()
        .min(10, "Enter your complete address"),

    city: z
        .string()
        .trim()
        .min(2, "City is required"),

    state: z
        .string()
        .trim()
        .min(2, "Province is required"),

    postalCode: z
        .string()
        .trim()
        .optional(),

    customerNote: z
        .string()
        .trim()
        .max(500, "Note cannot exceed 500 characters")
        .optional(),

    paymentMethod: z.enum(["cod"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const router = useRouter();

    const {
        items,
        subtotal,
        clearCart,
    } = useCart();

    const shippingAmount = items.length > 0 ? 250 : 0;
    const totalAmount = subtotal + shippingAmount;

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),

        defaultValues: {
            fullName: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            postalCode: "",
            customerNote: "",
            paymentMethod: "cod",
        },
    });

    async function onSubmit(
        values: CheckoutFormValues,
    ): Promise<void> {
        if (items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        try {
            const response = await fetch("/api/orders", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    shippingAddress: {
                        fullName: values.fullName,
                        phone: values.phone,
                        address: values.address,
                        city: values.city,
                        state: values.state,
                        postalCode:
                            values.postalCode || null,
                        country: "Pakistan",
                    },

                    customerNote:
                        values.customerNote || null,

                    paymentMethod:
                        values.paymentMethod,

                    items: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                }),
            });

            const data: {
                message?: string;
                orderId?: string;
            } = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to place order",
                );
            }

            clearCart();

            toast.success(
                data.message ||
                "Order placed successfully",
            );

            router.replace(
                data.orderId
                    ? `/orders/${data.orderId}`
                    : "/orders",
            );
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to place order",
            );
        }
    }

    if (items.length === 0) {
        return (
            <main className="min-h-screen">
                <Container>
                    <div className="py-20 text-center">
                        <h1 className="text-2xl font-bold">
                            Your cart is empty
                        </h1>

                        <Button
                            type="button"
                            className="mt-6"
                            onClick={() =>
                                router.push("/products")
                            }
                        >
                            Browse Products
                        </Button>
                    </div>
                </Container>
            </main>
        );
    }

    return (
        <main className="min-h-screen">
            <section className="py-12 sm:py-16">
                <Container>
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                            Secure Checkout
                        </p>

                        <h1 className="mt-2 text-3xl font-bold">
                            Complete Your Order
                        </h1>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]"
                        noValidate
                    >
                        <div className="rounded-2xl border bg-card p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <MapPin className="size-5 text-primary" />

                                <h2 className="text-xl font-semibold">
                                    Shipping Address
                                </h2>
                            </div>

                            <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                <Field
                                    label="Full Name"
                                    error={errors.fullName?.message}
                                >
                                    <Input
                                        placeholder="Muhammad Uzair"
                                        {...register("fullName")}
                                    />
                                </Field>

                                <Field
                                    label="Phone Number"
                                    error={errors.phone?.message}
                                >
                                    <Input
                                        type="tel"
                                        placeholder="03001234567"
                                        {...register("phone")}
                                    />
                                </Field>

                                <div className="sm:col-span-2">
                                    <Field
                                        label="Complete Address"
                                        error={
                                            errors.address?.message
                                        }
                                    >
                                        <Input
                                            placeholder="House, street and area"
                                            {...register("address")}
                                        />
                                    </Field>
                                </div>

                                <Field
                                    label="City"
                                    error={errors.city?.message}
                                >
                                    <Input
                                        placeholder="Sargodha"
                                        {...register("city")}
                                    />
                                </Field>

                                <Field
                                    label="Province"
                                    error={errors.state?.message}
                                >
                                    <Input
                                        placeholder="Punjab"
                                        {...register("state")}
                                    />
                                </Field>

                                <Field
                                    label="Postal Code"
                                    error={
                                        errors.postalCode?.message
                                    }
                                >
                                    <Input
                                        placeholder="40100"
                                        {...register("postalCode")}
                                    />
                                </Field>
                            </div>

                            <div className="mt-6 space-y-2">
                                <label className="text-sm font-medium">
                                    Order Note
                                </label>

                                <textarea
                                    rows={4}
                                    placeholder="Optional instructions"
                                    {...register("customerNote")}
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none"
                                />

                                {errors.customerNote && (
                                    <p className="text-sm text-destructive">
                                        {
                                            errors.customerNote
                                                .message
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="mt-6">
                                <p className="text-sm font-medium">
                                    Payment Method
                                </p>

                                <label className="mt-3 flex items-center gap-3 rounded-xl border p-4">
                                    <input
                                        type="radio"
                                        value="cod"
                                        {...register(
                                            "paymentMethod",
                                        )}
                                    />

                                    <div>
                                        <p className="font-semibold">
                                            Cash on Delivery
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            Pay when your order arrives.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <aside className="h-fit rounded-2xl border bg-card p-6 shadow-sm">
                            <h2 className="text-xl font-semibold">
                                Order Summary
                            </h2>

                            <div className="mt-6 space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="flex justify-between gap-4 text-sm"
                                    >
                                        <span className="line-clamp-2 text-muted-foreground">
                                            {item.name} ×{" "}
                                            {item.quantity}
                                        </span>

                                        <span className="shrink-0 font-medium">
                                            Rs.{" "}
                                            {(
                                                item.price *
                                                item.quantity
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 space-y-3 border-t pt-5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>

                                    <span>
                                        Rs.{" "}
                                        {subtotal.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Shipping
                                    </span>

                                    <span>
                                        Rs.{" "}
                                        {shippingAmount.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between border-t pt-4 text-lg font-bold">
                                    <span>Total</span>

                                    <span>
                                        Rs.{" "}
                                        {totalAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="mt-6 w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Placing Order...
                                    </>
                                ) : (
                                    "Place Order"
                                )}
                            </Button>
                        </aside>
                    </form>
                </Container>
            </section>

        </main>
    );
}

type FieldProps = {
    label: string;
    error?: string;
    children: React.ReactNode;
};

function Field({
    label,
    error,
    children,
}: FieldProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">
                {label}
            </label>

            {children}

            {error && (
                <p className="text-sm text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}