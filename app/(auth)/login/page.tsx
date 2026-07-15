"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
    loginSchema,
    type LoginFormValues,
} from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),

        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: LoginFormValues) {
        try {
            const result = await authClient.signIn.email({
                email: values.email.trim().toLowerCase(),
                password: values.password,
            });

            if (result.error) {
                toast.error(
                    result.error.message || "Invalid email or password",
                );
                return;
            }

            const sessionResult = await authClient.getSession();
            const role = sessionResult.data?.user?.role;

            toast.success("Login successful");

            if (role === "admin") {
                router.replace("/admin");
            } else if (role === "seller") {
                router.replace("/seller/dashboard");
            } else {
                router.replace("/");
            }

            router.refresh();
        } catch (error) {
            console.error("LOGIN_ERROR:", error);

            toast.error("Unable to login. Please try again.");
        }
    }

    return (
        <div className="mx-auto my-30 w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm">
            <h1 className="text-2xl font-bold">Login</h1>

            <p className="mt-2 text-sm text-muted-foreground">
                Login to continue to your account.
            </p>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-5"
                noValidate
            >
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
                        aria-invalid={Boolean(errors.email)}
                    />

                    {errors.email && (
                        <p className="text-sm text-destructive">
                            {errors.email.message}
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
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        {...register("password")}
                        aria-invalid={Boolean(errors.password)}
                    />

                    {errors.password && (
                        <p className="text-sm text-destructive">
                            {errors.password.message}
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
                            Logging in...
                        </>
                    ) : (
                        "Login"
                    )}
                </Button>
            </form>

            <p className="mt-5 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                    href="/signup"
                    className="font-semibold text-primary"
                >
                    Sign up
                </Link>
            </p>
        </div>
    );
}