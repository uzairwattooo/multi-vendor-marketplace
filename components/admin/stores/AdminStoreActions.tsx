"use client";

import { useMutation } from "@tanstack/react-query";
import {
    Ban,
    CheckCircle2,
    Loader2,
    RotateCcw,
    Settings2,
    XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ComponentType } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type StoreStatus =
    | "pending"
    | "approved"
    | "rejected"
    | "suspended";

type StoreAction =
    | { action: "approve" }
    | { action: "reject"; reason: string }
    | { action: "suspend"; reason: string }
    | { action: "restore" };

type AdminStoreActionsProps = {
    storeId: string;
    storeName: string;
    status: StoreStatus;
    compact?: boolean;
};

async function manageStore({
    storeId,
    input,
}: {
    storeId: string;
    input: StoreAction;
}) {
    const response = await fetch(`/api/admin/stores/${storeId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to manage store");
    }

    return data;
}

export default function AdminStoreActions({
    storeId,
    storeName,
    status,
    compact = false,
}: AdminStoreActionsProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [reasonAction, setReasonAction] = useState<
        "reject" | "suspend" | null
    >(null);

    const mutation = useMutation({
        mutationFn: manageStore,
        onSuccess: (data) => {
            toast.success(data.message);
            setReason("");
            setReasonAction(null);
            setOpen(false);
            router.refresh();
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to manage store",
            );
        },
    });

    function runAction(input: StoreAction) {
        mutation.mutate({ storeId, input });
    }

    return (
        <>
            <Button
                type="button"
                variant="outline"
                size={compact ? "sm" : "default"}
                onClick={() => setOpen(true)}
                className="gap-2 rounded-xl"
            >
                <Settings2 className="size-3.5" />
                Manage
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="w-full max-w-4xl p-0">
        <DialogHeader className="border-b px-6 py-5">
                        <DialogTitle className="text-lg">
                            Manage {storeName}
                        </DialogTitle>
                        <DialogDescription>
                            Review and change this store's marketplace status.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 px-6 py-6 overflow-y-auto max-h-[80vh]">
                        {(status === "pending" ||
                            status === "rejected") && (
                                <ActionCard
                                    icon={CheckCircle2}
                                    title="Approve store"
                                    description="Publish the store and grant the owner seller access."
                                    actionLabel="Approve Store"
                                    onClick={() =>
                                        runAction({ action: "approve" })
                                    }
                                    disabled={mutation.isPending}
                                />
                            )}

                        {status === "pending" && (
                            <ActionCard
                                icon={XCircle}
                                title="Reject application"
                                description="Reject this application and save a reason for the seller."
                                actionLabel="Add Rejection Reason"
                                variant="destructive"
                                onClick={() => {
                                    setReasonAction("reject");
                                    setReason("");
                                }}
                                disabled={mutation.isPending}
                            />
                        )}

                        {status === "approved" && (
                            <ActionCard
                                icon={Ban}
                                title="Suspend store"
                                description="Hide the store from the marketplace until it is restored."
                                actionLabel="Add Suspension Reason"
                                variant="destructive"
                                onClick={() => {
                                    setReasonAction("suspend");
                                    setReason("");
                                }}
                                disabled={mutation.isPending}
                            />
                        )}

                        {status === "suspended" && (
                            <ActionCard
                                icon={RotateCcw}
                                title="Restore store"
                                description="Return this suspended store to approved marketplace status."
                                actionLabel="Restore Store"
                                onClick={() =>
                                    runAction({ action: "restore" })
                                }
                                disabled={mutation.isPending}
                            />
                        )}

                        {reasonAction && (
                            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
                                <Label htmlFor={`store-reason-${storeId}`}>
                                    {reasonAction === "reject"
                                        ? "Rejection reason"
                                        : "Suspension reason"}
                                </Label>

                                <Textarea
                                    id={`store-reason-${storeId}`}
                                    value={reason}
                                    onChange={(event) =>
                                        setReason(event.target.value)
                                    }
                                    placeholder="Explain the moderation decision clearly."
                                    rows={4}
                                    className="mt-3 bg-background"
                                />

                                <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setReasonAction(null);
                                            setReason("");
                                        }}
                                        disabled={mutation.isPending}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() =>
                                            runAction(
                                                reasonAction === "reject"
                                                    ? {
                                                        action: "reject",
                                                        reason:
                                                            reason.trim(),
                                                    }
                                                    : {
                                                        action: "suspend",
                                                        reason:
                                                            reason.trim(),
                                                    },
                                            )
                                        }
                                        disabled={
                                            mutation.isPending ||
                                            reason.trim().length < 5
                                        }
                                    >
                                        Confirm {reasonAction}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {mutation.isPending && (
                            <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="size-4 animate-spin" />
                                Updating store...
                            </p>
                        )}
                    </div>

                    <DialogFooter className="mx-0 mb-0 px-6 py-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={mutation.isPending}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

type ActionCardProps = {
    icon: ComponentType<{ className?: string }>;
    title: string;
    description: string;
    actionLabel: string;
    variant?: "default" | "destructive";
    onClick: () => void;
    disabled?: boolean;
};

function ActionCard({
    icon: Icon,
    title,
    description,
    actionLabel,
    variant = "default",
    onClick,
    disabled,
}: ActionCardProps) {
    return (
        <div className="rounded-2xl border p-5">
            <div className="flex items-start gap-3">
                <div
                    className={
                        variant === "destructive"
                            ? "flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive"
                            : "flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                    }
                >
                    <Icon className="size-5" />
                </div>

                <div className="min-w-0">
                    <h3 className="font-semibold">
                        {title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>

            <div className="mt-5 border-t pt-4">
                <Button
                    type="button"
                    variant={variant}
                    onClick={onClick}
                    disabled={disabled}
                    className="w-full sm:w-auto"
                >
                    {actionLabel}
                </Button>
            </div>
        </div>
    );
}
