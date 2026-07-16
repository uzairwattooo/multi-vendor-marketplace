"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
    signupSchema,
    type SignupFormValues,
} from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),

        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            role: "buyer",
        },
    });

    async function onSubmit(values: SignupFormValues) {
        try {
            const result = await authClient.signUp.email({
                name: values.name.trim(),
                email: values.email.trim().toLowerCase(),
                password: values.password,
                phone: values.phone.trim(),
                role: values.role,
                fetchOptions: {
                    onError: async ({ response }) => {
                        if (response.status === 429) {
                            const retryAfter =
                                response.headers.get("X-Retry-After");

                            toast.error(
                                `Too many signup attempts. Try again after ${retryAfter ?? "60"
                                } seconds.`,
                            );
                        }
                    },
                },
            });

            if (result.error) {
                const message =
                    result.error.message?.toLowerCase().includes("already")
                        ? "An account with this email already exists"
                        : result.error.message || "Unable to create account";

                toast.error(message);
                return;
            }

            toast.success("Account created successfully");

            if (values.role === "seller") {
                router.replace("/seller/onboarding");
            } else {
                router.replace("/");
            }

            router.refresh();
        } catch (error) {
            console.error("SIGNUP_ERROR:", error);

            toast.error(
                "Unable to create account. Please try again.",
            );
        }
    }

    return (
        <div className="mx-auto w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm">
            <h1 className="text-2xl font-bold">Create Account</h1>

            <p className="mt-2 text-sm text-muted-foreground">
                Create your buyer or seller account.
            </p>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-5"
                noValidate
            >
                <div className="space-y-2">
                    <label
                        htmlFor="name"
                        className="text-sm font-medium"
                    >
                        Full Name
                    </label>

                    <Input
                        id="name"
                        placeholder="Enter your full name"
                        autoComplete="name"
                        {...register("name")}
                    />

                    {errors.name && (
                        <p className="text-sm text-destructive">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="text-sm font-medium"
                    >
                        Email
                    </label>

                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        {...register("email")}
                    />

                    {errors.email && (
                        <p className="text-sm text-destructive">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="phone"
                        className="text-sm font-medium"
                    >
                        Phone Number
                    </label>

                    <Input
                        id="phone"
                        type="tel"
                        placeholder="03001234567"
                        autoComplete="tel"
                        {...register("phone")}
                    />

                    {errors.phone && (
                        <p className="text-sm text-destructive">
                            {errors.phone.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="role"
                        className="text-sm font-medium"
                    >
                        Account Type
                    </label>

                    <select
                        id="role"
                        {...register("role")}
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none"
                    >
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                    </select>

                    {errors.role && (
                        <p className="text-sm text-destructive">
                            {errors.role.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium"
                    >
                        Password
                    </label>

                    <Input
                        id="password"
                        type="password"
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        {...register("password")}
                    />

                    {errors.password && (
                        <p className="text-sm text-destructive">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
                    >
                        Confirm Password
                    </label>

                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Enter password again"
                        autoComplete="new-password"
                        {...register("confirmPassword")}
                    />

                    {errors.confirmPassword && (
                        <p className="text-sm text-destructive">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        "Create Account"
                    )}
                </Button>
            </form>

            <p className="mt-5 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-semibold text-primary"
                >
                    Login
                </Link>
            </p>
        </div>
    );
}