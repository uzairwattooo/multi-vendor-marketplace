"use client";

import { useMutation } from "@tanstack/react-query";
import {
    Ban,
    BadgeCheck,
    KeyRound,
    Loader2,
    LogOut,
    Settings2,
    ShieldCheck,
    UserCheck,
    UserRound,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

type AdminUserActionsProps = {
    userId: string;
    userName: string;
    phone: string | null;
    role: string;
    banned: boolean | null;
    emailVerified: boolean;
    storeStatus?: "pending" | "approved" | "rejected" | "suspended" | null;
    isCurrentAdmin?: boolean;
};

type UserActionInput =
    | { action: "set_role"; role: "buyer" | "seller" | "admin" }
    | {
          action: "ban";
          reason: string;
          durationDays: number | null;
      }
    | { action: "unban" }
    | { action: "revoke_sessions" }
    | { action: "verify_email" }
    | { action: "update_profile"; name: string; phone: string }
    | { action: "set_password"; newPassword: string };

async function updateUser({
    userId,
    input,
}: {
    userId: string;
    input: UserActionInput;
}) {
    const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to update user");
    }

    return data;
}

export default function AdminUserActions({
    userId,
    userName,
    phone,
    role,
    banned,
    emailVerified,
    storeStatus = null,
    isCurrentAdmin = false,
}: AdminUserActionsProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<
        "buyer" | "seller" | "admin"
    >(
        role === "seller" || role === "admin"
            ? role
            : "buyer",
    );
    const [profileName, setProfileName] = useState(userName);
    const [profilePhone, setProfilePhone] = useState(phone ?? "");
    const [newPassword, setNewPassword] = useState("");
    const [banReason, setBanReason] = useState("");
    const [duration, setDuration] = useState("permanent");

    const mutation = useMutation({
        mutationFn: updateUser,
        onSuccess: (data) => {
            toast.success(data.message);
            setBanReason("");
            setNewPassword("");
            setOpen(false);
            router.refresh();
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to update user",
            );
        },
    });

    function runAction(input: UserActionInput) {
        mutation.mutate({ userId, input });
    }

    return (
        <>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
                className="gap-2 rounded-xl"
            >
                <Settings2 className="size-3.5" />
                Manage
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0">
                    <DialogHeader className="border-b px-6 py-5">
                        <DialogTitle className="text-lg">
                            Manage {userName}
                        </DialogTitle>
                        <DialogDescription>
                            Update access, verification and account security.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 px-6 py-6">
                        {isCurrentAdmin && (
                            <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-300">
                                This is your current admin account. Self role,
                                ban and session actions are protected.
                            </div>
                        )}

                        <section className="rounded-2xl border p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                                    <ShieldCheck className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        Role and permissions
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Choose the marketplace dashboard this
                                        user can access.
                                    </p>
                                </div>
                            </div>

                            {storeStatus !== "approved" && (
                                <p className="mt-4 rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                                    Seller access is enabled automatically after the user's store is approved.
                                </p>
                            )}

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                <select
                                    value={selectedRole}
                                    onChange={(event) =>
                                        setSelectedRole(
                                            event.target.value as
                                                | "buyer"
                                                | "seller"
                                                | "admin",
                                        )
                                    }
                                    className="h-9 flex-1 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
                                    disabled={isCurrentAdmin}
                                >
                                    <option value="buyer">Buyer</option>
                                    <option
                                        value="seller"
                                        disabled={storeStatus !== "approved"}
                                    >
                                        Seller
                                    </option>
                                    <option value="admin">Admin</option>
                                </select>

                                <Button
                                    type="button"
                                    onClick={() =>
                                        runAction({
                                            action: "set_role",
                                            role: selectedRole,
                                        })
                                    }
                                    disabled={
                                        mutation.isPending ||
                                        isCurrentAdmin ||
                                        selectedRole === role
                                    }
                                >
                                    Save Role
                                </Button>
                            </div>
                        </section>

                        <section className="rounded-2xl border p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
                                    <UserRound className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        Profile details
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Correct the user's display name or phone number.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor={`profile-name-${userId}`}>
                                        Full name
                                    </Label>
                                    <Input
                                        id={`profile-name-${userId}`}
                                        value={profileName}
                                        onChange={(event) =>
                                            setProfileName(event.target.value)
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`profile-phone-${userId}`}>
                                        Phone
                                    </Label>
                                    <Input
                                        id={`profile-phone-${userId}`}
                                        value={profilePhone}
                                        onChange={(event) =>
                                            setProfilePhone(event.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="mt-4"
                                onClick={() =>
                                    runAction({
                                        action: "update_profile",
                                        name: profileName.trim(),
                                        phone: profilePhone.trim(),
                                    })
                                }
                                disabled={
                                    mutation.isPending ||
                                    profileName.trim().length < 2 ||
                                    profilePhone.trim().length < 7
                                }
                            >
                                Save Profile
                            </Button>
                        </section>

                        <section className="rounded-2xl border p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                                    <KeyRound className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        Reset password
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Set a new password for this user's credential account.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={(event) =>
                                        setNewPassword(event.target.value)
                                    }
                                    minLength={8}
                                    placeholder="Minimum 8 characters"
                                    className="flex-1"
                                />

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        runAction({
                                            action: "set_password",
                                            newPassword,
                                        })
                                    }
                                    disabled={
                                        mutation.isPending ||
                                        newPassword.length < 8
                                    }
                                >
                                    Set Password
                                </Button>
                            </div>
                        </section>

                        {!emailVerified && (
                            <section className="rounded-2xl border p-5">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                                            <BadgeCheck className="size-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">
                                                Email verification
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Manually mark this email as
                                                verified.
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            runAction({
                                                action: "verify_email",
                                            })
                                        }
                                        disabled={mutation.isPending}
                                    >
                                        <UserCheck className="size-4" />
                                        Verify Email
                                    </Button>
                                </div>
                            </section>
                        )}

                        <section className="rounded-2xl border p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                                        <LogOut className="size-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Active sessions
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Sign the user out from every device.
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        runAction({
                                            action: "revoke_sessions",
                                        })
                                    }
                                    disabled={
                                        mutation.isPending || isCurrentAdmin
                                    }
                                >
                                    Revoke Sessions
                                </Button>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                                    <Ban className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        Account restriction
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Banning prevents login and revokes
                                        existing sessions.
                                    </p>
                                </div>
                            </div>

                            {banned ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() =>
                                        runAction({ action: "unban" })
                                    }
                                    disabled={
                                        mutation.isPending || isCurrentAdmin
                                    }
                                >
                                    Unban User
                                </Button>
                            ) : (
                                <div className="mt-4 space-y-4">
                                    {storeStatus === "approved" && (
                                        <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
                                            Suspend this user's approved store before banning the seller account.
                                        </p>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor={`ban-${userId}`}>
                                            Ban reason
                                        </Label>
                                        <Textarea
                                            id={`ban-${userId}`}
                                            value={banReason}
                                            onChange={(event) =>
                                                setBanReason(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Explain why this account is being restricted."
                                            rows={3}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <select
                                            value={duration}
                                            onChange={(event) =>
                                                setDuration(
                                                    event.target.value,
                                                )
                                            }
                                            className="h-9 flex-1 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
                                        >
                                            <option value="1">1 day</option>
                                            <option value="7">7 days</option>
                                            <option value="30">30 days</option>
                                            <option value="90">90 days</option>
                                            <option value="permanent">
                                                Permanent
                                            </option>
                                        </select>

                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() =>
                                                runAction({
                                                    action: "ban",
                                                    reason: banReason.trim(),
                                                    durationDays:
                                                        duration ===
                                                        "permanent"
                                                            ? null
                                                            : Number(
                                                                  duration,
                                                              ),
                                                })
                                            }
                                            disabled={
                                                mutation.isPending ||
                                                isCurrentAdmin ||
                                                storeStatus === "approved" ||
                                                banReason.trim().length < 5
                                            }
                                        >
                                            Ban User
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    <DialogFooter className="mx-0 mb-0 px-6 py-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Close
                        </Button>

                        {mutation.isPending && (
                            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="size-4 animate-spin" />
                                Updating account...
                            </span>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
