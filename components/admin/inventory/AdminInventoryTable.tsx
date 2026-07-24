"use client";

import { useMutation } from "@tanstack/react-query";
import {
    Box,
    Boxes,
    Edit3,
    Loader2,
    PackageCheck,
    PackageX,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
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
import { Switch } from "@/components/ui/switch";
import type { AdminInventoryItem } from "@/lib/admin/get-admin-inventory";
import { cn } from "@/lib/utils";

type InventoryInput = {
    quantity: number;
    reservedQuantity: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
};

async function updateInventory({
    productId,
    input,
}: {
    productId: string;
    input: InventoryInput;
}) {
    const response = await fetch(`/api/admin/inventory/${productId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to update inventory");
    }

    return data;
}

function formatDate(value: Date | string | null | undefined) {
    if (!value) return "Not available";

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return new Intl.DateTimeFormat("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function getStockState(item: AdminInventoryItem) {
    if (item.availableQuantity <= 0) {
        return {
            value: "out_of_stock",
            label: "Out of stock",
            icon: PackageX,
            className: "text-destructive",
        };
    }

    if (item.availableQuantity <= item.lowStockThreshold) {
        return {
            value: "low_stock",
            label: "Low stock",
            icon: Boxes,
            className: "text-amber-600",
        };
    }

    return {
        value: "healthy",
        label: "Healthy",
        icon: PackageCheck,
        className: "text-emerald-600",
    };
}

export default function AdminInventoryTable({
    items,
}: {
    items: AdminInventoryItem[];
}) {
    const router = useRouter();
    const [editingItem, setEditingItem] =
        useState<AdminInventoryItem | null>(null);
    const [quantity, setQuantity] = useState("0");
    const [reservedQuantity, setReservedQuantity] = useState("0");
    const [lowStockThreshold, setLowStockThreshold] = useState("5");
    const [trackQuantity, setTrackQuantity] = useState(true);

    const mutation = useMutation({
        mutationFn: updateInventory,
        onSuccess: (data) => {
            toast.success(data.message);
            setEditingItem(null);
            router.refresh();
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to update inventory",
            );
        },
    });

    function openEditor(item: AdminInventoryItem) {
        setEditingItem(item);
        setQuantity(String(item.quantity));
        setReservedQuantity(String(item.reservedQuantity));
        setLowStockThreshold(String(item.lowStockThreshold));
        setTrackQuantity(item.trackQuantity);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!editingItem) return;

        const numericQuantity = Number(quantity);
        const numericReserved = Number(reservedQuantity);
        const numericThreshold = Number(lowStockThreshold);

        if (
            !Number.isInteger(numericQuantity) ||
            !Number.isInteger(numericReserved) ||
            !Number.isInteger(numericThreshold) ||
            numericQuantity < 0 ||
            numericReserved < 0 ||
            numericThreshold < 0
        ) {
            toast.error("Inventory values must be positive whole numbers");
            return;
        }

        if (numericReserved > numericQuantity) {
            toast.error("Reserved quantity cannot exceed total quantity");
            return;
        }

        mutation.mutate({
            productId: editingItem.productId,
            input: {
                quantity: numericQuantity,
                reservedQuantity: numericReserved,
                lowStockThreshold: numericThreshold,
                trackQuantity,
            },
        });
    }

    if (items.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed bg-card px-6 py-16 text-center shadow-sm">
                <Boxes className="mx-auto size-8 text-muted-foreground" />
                <h2 className="mt-4 text-lg font-semibold">
                    No inventory records found
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Try another stock state, store or search term.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1080px] text-sm">
                        <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                            <tr>
                                <th className="px-5 py-4 font-semibold">Product</th>
                                <th className="px-5 py-4 font-semibold">Store</th>
                                <th className="px-5 py-4 font-semibold">Total</th>
                                <th className="px-5 py-4 font-semibold">Reserved</th>
                                <th className="px-5 py-4 font-semibold">Available</th>
                                <th className="px-5 py-4 font-semibold">State</th>
                                <th className="px-5 py-4 font-semibold">Tracking</th>
                                <th className="px-5 py-4 text-right font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {items.map((item) => {
                                const stockState = getStockState(item);
                                const StockIcon = stockState.icon;

                                return (
                                    <tr
                                        key={item.productId}
                                        className="transition-colors hover:bg-muted/25"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-muted/50">
                                                    {item.image ? (

                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="size-full object-cover"
                                                        />
                                                    ) : (
                                                        <Box className="size-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 max-w-[240px]">
                                                    <Link
                                                        href={`/admin/products/${item.productId}`}
                                                        className="block truncate font-semibold hover:text-primary"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <p className="mt-1 truncate text-xs text-muted-foreground">
                                                        {item.sku}
                                                    </p>
                                                    <div className="mt-2">
                                                        <AdminStatusBadge
                                                            value={item.status}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <Link
                                                href={`/admin/stores/${item.storeId}`}
                                                className="font-medium hover:text-primary"
                                            >
                                                {item.storeName}
                                            </Link>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Updated {formatDate(item.updatedAt)}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 font-semibold">
                                            {item.quantity.toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={cn(
                                                    "font-semibold",
                                                    item.reservedQuantity > 0 &&
                                                    "text-blue-600",
                                                )}
                                            >
                                                {item.reservedQuantity.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={cn(
                                                    "font-bold",
                                                    stockState.className,
                                                )}
                                            >
                                                {item.availableQuantity.toLocaleString()}
                                            </span>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Alert at {item.lowStockThreshold}
                                            </p>
                                        </td>
                                        <td className="px-0 py-4">
                                            <div className="flex items-center gap-2">
                                                <StockIcon
                                                    className={cn(
                                                        "size-4",
                                                        stockState.className,
                                                    )}
                                                />
                                                <AdminStatusBadge
                                                    value={stockState.value}
                                                    label={stockState.label}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <AdminStatusBadge
                                                value={
                                                    item.trackQuantity
                                                        ? "tracked"
                                                        : "not_tracked"
                                                }
                                                label={
                                                    item.trackQuantity
                                                        ? "Tracked"
                                                        : "Not tracked"
                                                }
                                            />
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="rounded-xl"
                                                onClick={() => openEditor(item)}
                                            >
                                                <Edit3 className="size-3.5" />
                                                Update
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog
                open={Boolean(editingItem)}
                onOpenChange={(open) => {
                    if (!open && !mutation.isPending) {
                        setEditingItem(null);
                    }
                }}
            >
                <DialogContent className="w-full max-w-2xl p-0 overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader className="border-b px-6 py-5">
                            <DialogTitle>
                                Update {editingItem?.name ?? "inventory"}
                            </DialogTitle>
                            <DialogDescription>
                                The available stock is total quantity minus
                                reserved quantity. Product stock is synchronized
                                automatically.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="inventory-quantity">
                                    Total quantity
                                </Label>
                                <Input
                                    id="inventory-quantity"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={quantity}
                                    onChange={(event) =>
                                        setQuantity(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="inventory-reserved">
                                    Reserved quantity
                                </Label>
                                <Input
                                    id="inventory-reserved"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={reservedQuantity}
                                    onChange={(event) =>
                                        setReservedQuantity(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="inventory-threshold">
                                    Low stock threshold
                                </Label>
                                <Input
                                    id="inventory-threshold"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={lowStockThreshold}
                                    onChange={(event) =>
                                        setLowStockThreshold(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between rounded-2xl border bg-muted/20 p-4">
                                <div>
                                    <Label htmlFor="inventory-tracking">
                                        Track quantity
                                    </Label>
                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                        Enable detailed inventory monitoring.
                                    </p>
                                </div>
                                <Switch
                                    id="inventory-tracking"
                                    checked={trackQuantity}
                                    onCheckedChange={setTrackQuantity}
                                />
                            </div>

                            <div className="rounded-2xl border bg-muted/30 p-4 sm:col-span-2">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Calculated available stock
                                </p>
                                <p className="mt-2 text-2xl font-bold">
                                    {Math.max(
                                        0,
                                        Number(quantity || 0) -
                                        Number(reservedQuantity || 0),
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="border-t px-6 pb-8 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingItem(null)}
                                disabled={mutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending && (
                                    <Loader2 className="size-4 animate-spin" />
                                )}
                                {mutation.isPending
                                    ? "Updating..."
                                    : "Update Inventory"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
