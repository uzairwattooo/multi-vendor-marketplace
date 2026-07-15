"use client";

import { useMutation } from "@tanstack/react-query";
import {
    Building2,
    Check,
    Loader2,
    MapPin,
    Store,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { formatDate } from "@/lib/format-date";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type PendingStore = {
    id: string;
    name: string;
    category: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    description: string | null;
    createdAt: Date;
    owner: {
        name: string;
        email: string;
    };
};

type PendingStoresTableProps = {
    stores: PendingStore[];
};

type ModerateStoreInput =
    | {
        storeId: string;
        action: "approve";
    }
    | {
        storeId: string;
        action: "reject";
        reason: string;
    };

async function moderateStore(input: ModerateStoreInput) {
    const response = await fetch(
        `/api/admin/stores/${input.storeId}`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(
                input.action === "approve"
                    ? {
                        action: "approve",
                    }
                    : {
                        action: "reject",
                        reason: input.reason,
                    },
            ),
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to moderate store",
        );
    }

    return data;
}

export default function PendingStoresTable({
    stores,
}: PendingStoresTableProps) {
    const router = useRouter();

    const [rejectingStoreId, setRejectingStoreId] =
        useState<string | null>(null);

    const [rejectionReason, setRejectionReason] =
        useState("");

    const mutation = useMutation({
        mutationFn: moderateStore,

        onSuccess: (data) => {
            toast.success(data.message);

            setRejectingStoreId(null);
            setRejectionReason("");

            router.refresh();
        },

        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to moderate store",
            );
        },
    });

    function handleApprove(storeId: string) {
        mutation.mutate({
            storeId,
            action: "approve",
        });
    }

    function handleReject(storeId: string) {
        if (rejectionReason.trim().length < 10) {
            toast.error(
                "Rejection reason must be at least 10 characters",
            );
            return;
        }

        mutation.mutate({
            storeId,
            action: "reject",
            reason: rejectionReason,
        });
    }

    if (stores.length === 0) {
        return (
            <div className="rounded-3xl border bg-card p-10 text-center shadow-sm">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Store className="size-7" />
                </div>

                <h2 className="mt-5 text-xl font-semibold">
                    No pending applications
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    New store applications will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {stores.map((currentStore) => {
                const isCurrentRequest =
                    mutation.isPending &&
                    mutation.variables?.storeId === currentStore.id;

                const isRejecting =
                    rejectingStoreId === currentStore.id;

                return (
                    <article
                        key={currentStore.id}
                        className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8"
                    >
                        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start gap-4">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <Building2 className="size-6" />
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-xl font-semibold">
                                                {currentStore.name}
                                            </h2>

                                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                                Pending
                                            </span>
                                        </div>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {currentStore.category}
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground">
                                    {currentStore.description}
                                </p>

                                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <DetailItem
                                        label="Owner"
                                        value={currentStore.owner.name}
                                    />

                                    <DetailItem
                                        label="Owner email"
                                        value={currentStore.owner.email}
                                    />

                                    <DetailItem
                                        label="Business email"
                                        value={currentStore.email}
                                    />

                                    <DetailItem
                                        label="Phone"
                                        value={currentStore.phone}
                                    />

                                    <DetailItem
                                        label="Location"
                                        value={`${currentStore.city}, ${currentStore.country}`}
                                        icon={<MapPin className="size-4" />}
                                    />

                                    <DetailItem
                                        label="Submitted"
                                        value={formatDate(currentStore.createdAt)}
                                    />
                                </div>
                            </div>

                            <div className="flex shrink-0 flex-col gap-3 sm:flex-row xl:flex-col">
                                <Button
                                    type="button"
                                    onClick={() =>
                                        handleApprove(currentStore.id)
                                    }
                                    disabled={mutation.isPending}
                                    className="min-w-36"
                                >
                                    {isCurrentRequest &&
                                        mutation.variables?.action ===
                                        "approve" ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <Check className="size-4" />
                                    )}

                                    Approve
                                </Button>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => {
                                        setRejectingStoreId(
                                            isRejecting
                                                ? null
                                                : currentStore.id,
                                        );

                                        setRejectionReason("");
                                    }}
                                    disabled={mutation.isPending}
                                    className="min-w-36"
                                >
                                    <X className="size-4" />
                                    Reject
                                </Button>
                            </div>
                        </div>

                        {isRejecting && (
                            <div className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
                                <label
                                    htmlFor={`reason-${currentStore.id}`}
                                    className="text-sm font-semibold"
                                >
                                    Rejection reason
                                </label>

                                <Textarea
                                    id={`reason-${currentStore.id}`}
                                    value={rejectionReason}
                                    onChange={(event) =>
                                        setRejectionReason(
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Explain why this store application is being rejected."
                                    rows={4}
                                    className="mt-3 bg-background"
                                />

                                <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setRejectingStoreId(null);
                                            setRejectionReason("");
                                        }}
                                        disabled={mutation.isPending}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() =>
                                            handleReject(currentStore.id)
                                        }
                                        disabled={mutation.isPending}
                                    >
                                        {isCurrentRequest &&
                                            mutation.variables?.action ===
                                            "reject" ? (
                                            <>
                                                <Loader2 className="size-4 animate-spin" />
                                                Rejecting...
                                            </>
                                        ) : (
                                            <>
                                                <X className="size-4" />
                                                Confirm rejection
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </article>
                );
            })}
        </div>
    );
}

type DetailItemProps = {
    label: string;
    value: string;
    icon?: React.ReactNode;
};

function DetailItem({
    label,
    value,
    icon,
}: DetailItemProps) {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </p>

            <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                {icon}
                <span className="truncate">{value}</span>
            </div>
        </div>
    );
}