"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2, Plus, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialForm = {
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "buyer",
};

async function createUser(input: typeof initialForm) {
    const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to create user");
    }

    return data;
}

export default function CreateUserDialog() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(initialForm);

    const mutation = useMutation({
        mutationFn: createUser,
        onSuccess: (data) => {
            toast.success(data.message);
            setForm(initialForm);
            setOpen(false);
            router.refresh();
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to create user",
            );
        },
    });

    return (
        <>
            <Button
                type="button"
                onClick={() => setOpen(true)}
                className="h-10 gap-2 rounded-xl"
            >
                <Plus className="size-4" />
                Add User
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-xl p-0">
                    <DialogHeader className="border-b px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center px-3 justify-center rounded-xl bg-primary/10 text-primary">
                                <UserPlus className="size-5" />
                            </div>

                            <div>
                                <DialogTitle className="text-lg">
                                    Create marketplace user
                                </DialogTitle>
                                <DialogDescription className="mt-1">
                                    Add a buyer or administrator account. Seller access is granted after store approval.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            mutation.mutate(form);
                        }}
                    >
                        <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="admin-user-name">
                                    Full name
                                </Label>
                                <Input
                                    id="admin-user-name"
                                    value={form.name}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            name: event.target.value,
                                        }))
                                    }
                                    placeholder="Muhammad Ali"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="admin-user-email">
                                    Email
                                </Label>
                                <Input
                                    id="admin-user-email"
                                    type="email"
                                    value={form.email}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            email: event.target.value,
                                        }))
                                    }
                                    placeholder="user@example.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="admin-user-phone">
                                    Phone
                                </Label>
                                <Input
                                    id="admin-user-phone"
                                    value={form.phone}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            phone: event.target.value,
                                        }))
                                    }
                                    placeholder="+92 300 0000000"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="admin-user-password">
                                    Temporary password
                                </Label>
                                <Input
                                    id="admin-user-password"
                                    type="password"
                                    value={form.password}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            password: event.target.value,
                                        }))
                                    }
                                    minLength={8}
                                    placeholder="Minimum 8 characters"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="admin-user-role">
                                    Role
                                </Label>
                                <select
                                    id="admin-user-role"
                                    value={form.role}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            role: event.target.value,
                                        }))
                                    }
                                    className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
                                >
                                    <option value="buyer">Buyer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <DialogFooter className="mx-0 mb-0 px-6 py-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
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
                                        <Loader2 className="size-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create User"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
