"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
    changePasswordSchema,
    type ChangePasswordSchema,
} from "@/lib/validations/change-password-schema";

import { changePassword } from "@/lib/actions/profile";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



export default function ChangePasswordForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordSchema>({
        resolver: zodResolver(
            changePasswordSchema,
        ),
    });


    const [isPending, startTransition] =
        useTransition();

    async function onSubmit(
        values: ChangePasswordSchema,
    ) {
        startTransition(async () => {
            try {
                await changePassword(values);

                toast.success(
                    "Password updated successfully."
                );

                reset();
            } catch {
                toast.error(
                    "Current password is incorrect."
                );
            }
        });
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            <Input
                type="password"
                placeholder="Current Password"
                {...register("currentPassword")}
            />

            <p className="text-sm text-red-500">
                {errors.currentPassword?.message}
            </p>

            <Input
                type="password"
                placeholder="New Password"
                {...register("newPassword")}
            />

            <p className="text-sm text-red-500">
                {errors.newPassword?.message}
            </p>

            <Input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
            />

            <p className="text-sm text-red-500">
                {errors.confirmPassword?.message}
            </p>

            <Button
                type="submit"
                disabled={isPending}
            >
                {isPending
                    ? "Updating..."
                    : "Update Password"}
            </Button>
        </form>
    )
}