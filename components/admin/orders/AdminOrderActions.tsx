"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2, RotateCcw, Settings2, XCircle } from "lucide-react";
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
import type { OrderStatus } from "@/lib/admin/get-admin-orders";

type Action =
    | { action: "set_status"; status: OrderStatus }
    | { action: "cancel"; reason: string }
    | { action: "refund"; reason: string };

async function updateOrder(orderId: string, input: Action) {
    const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Unable to update order");
    return data as { message: string };
}

export default function AdminOrderActions({
    orderId,
    orderNumber,
    status,
    paymentMethod,
    paymentStatus,
}: {
    orderId: string;
    orderNumber: string;
    status: OrderStatus;
    paymentMethod: "stripe" | "cod";
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
}) {
    const router = useRouter();
    const [mode, setMode] = useState<"status" | "cancel" | "refund" | null>(null);
    const [nextStatus, setNextStatus] = useState<OrderStatus>(status);
    const [reason, setReason] = useState("");
    const mutation = useMutation({
        mutationFn: (input: Action) => updateOrder(orderId, input),
        onSuccess: (data) => {
            toast.success(data.message);
            setMode(null);
            setReason("");
            router.refresh();
        },
        onError: (error) =>
            toast.error(error instanceof Error ? error.message : "Unable to update order"),
    });
    const terminal = status === "cancelled" || status === "refunded";
    const canRefund =
        paymentMethod === "stripe" &&
        paymentStatus === "paid" &&
        status !== "refunded";

    return (
        <>
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-xl" disabled={terminal} onClick={() => setMode("status")}><Settings2 />Update status</Button>
                <Button variant="destructive" className="rounded-xl" disabled={terminal || status === "delivered"} onClick={() => setMode("cancel")}><XCircle />Cancel order</Button>
                <Button variant="destructive" className="rounded-xl" disabled={!canRefund} onClick={() => setMode("refund")}><RotateCcw />Refund payment</Button>
            </div>

            <Dialog open={mode !== null} onOpenChange={(open) => !open && setMode(null)}>
                <DialogContent className="rounded-2xl sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{mode === "status" ? "Update order status" : mode === "cancel" ? "Cancel order" : "Refund Stripe payment"}</DialogTitle>
                        <DialogDescription>{orderNumber} · This admin action is recorded on the order.</DialogDescription>
                    </DialogHeader>
                    {mode === "status" ? (
                        <select value={nextStatus} onChange={(event) => setNextStatus(event.target.value as OrderStatus)} className="h-10 rounded-xl border bg-background px-3 text-sm outline-none">
                            {["pending", "confirmed", "processing", "shipped", "delivered"].map((value) => <option key={value} value={value}>{value}</option>)}
                        </select>
                    ) : (
                        <textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder={mode === "cancel" ? "Cancellation reason (required)" : "Refund reason (required)"} className="min-h-28 rounded-xl border bg-background p-3 text-sm outline-none focus:ring-3 focus:ring-primary/10" />
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setMode(null)} disabled={mutation.isPending}>Keep order</Button>
                        <Button
                            variant={mode === "status" ? "default" : "destructive"}
                            disabled={mutation.isPending || (mode !== "status" && reason.trim().length < 3)}
                            onClick={() => {
                                if (mode === "status") mutation.mutate({ action: "set_status", status: nextStatus });
                                if (mode === "cancel") mutation.mutate({ action: "cancel", reason: reason.trim() });
                                if (mode === "refund") mutation.mutate({ action: "refund", reason: reason.trim() });
                            }}
                        >
                            {mutation.isPending && <Loader2 className="animate-spin" />}
                            Confirm action
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
