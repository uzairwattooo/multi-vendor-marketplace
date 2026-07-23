"use client";

import { useMutation } from "@tanstack/react-query";
import {
    Archive,
    ArrowUpRight,
    CheckCircle2,
    CircleOff,
    FilePenLine,
    Loader2,
    Package,
    Settings2,
    ShieldCheck,
    Sparkles,
    Star,
    StarOff,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ComponentType } from "react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type ProductStatus =
    | "draft"
    | "active"
    | "out_of_stock"
    | "archived";

type ProductAction =
    | {
        action: "set_status";
        status: ProductStatus;
    }
    | {
        action: "set_featured";
        featured: boolean;
    };

type AdminProductActionsProps = {
    productId: string;
    productName: string;
    status: ProductStatus;
    featured: boolean;
    stock: number;
    storeStatus: "pending" | "approved" | "rejected" | "suspended";
    compact?: boolean;
};

async function manageProduct({
    productId,
    input,
}: {
    productId: string;
    input: ProductAction;
}) {
    const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to manage product");
    }

    return data;
}

export default function AdminProductActions({
    productId,
    productName,
    status,
    featured,
    stock,
    storeStatus,
    compact = false,
}: AdminProductActionsProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const mutation = useMutation({
        mutationFn: manageProduct,
        onSuccess: (data) => {
            toast.success(data.message);
            setOpen(false);
            router.refresh();
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to manage product",
            );
        },
    });

    function runAction(input: ProductAction) {
        mutation.mutate({ productId, input });
    }

    const canActivate = stock > 0 && storeStatus === "approved";
    const canFeature = status === "active" && canActivate;

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
                <DialogContent className="max-h-[92vh] w-[calc(100%-24px)] overflow-hidden rounded-[28px] border-0 p-0 shadow-2xl sm:max-w-[980px]">
                    {/* Header */}
                    <DialogHeader className="relative border-b bg-gradient-to-r from-slate-50 via-white to-slate-50 px-6 py-6 pr-16 sm:px-8">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                                <Package className="size-6" />
                            </div>

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <DialogTitle className="truncate text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                                        Manage product
                                    </DialogTitle>

                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "rounded-full px-2.5 py-1 text-[11px] font-medium capitalize",
                                            status === "active" &&
                                            "border-emerald-200 bg-emerald-50 text-emerald-700",
                                            status === "draft" &&
                                            "border-amber-200 bg-amber-50 text-amber-700",
                                            status === "out_of_stock" &&
                                            "border-rose-200 bg-rose-50 text-rose-700",
                                            status === "archived" &&
                                            "border-slate-200 bg-slate-100 text-slate-600",
                                        )}
                                    >
                                        {status.replaceAll("_", " ")}
                                    </Badge>

                                    {featured && (
                                        <Badge className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-medium text-violet-700 hover:bg-violet-100">
                                            <Star className="mr-1 size-3 fill-current" />
                                            Featured
                                        </Badge>
                                    )}
                                </div>

                                <p className="mt-1 truncate text-sm font-medium text-slate-700">
                                    {productName}
                                </p>

                                <DialogDescription className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                                    Manage visibility, catalog status and featured placement
                                    from one place.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Body */}
                    <div className="grid max-h-[68vh] overflow-y-auto lg:grid-cols-[280px_minmax(0,1fr)]">
                        {/* Left summary panel */}
                        <aside className="border-b bg-slate-50/70 p-6 lg:border-r lg:border-b-0 lg:p-7">
                            <div className="rounded-2xl border bg-white p-5 shadow-sm">
                                <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                                    <Package className="size-7" />
                                </div>

                                <h3 className="mt-4 line-clamp-2 text-base font-semibold leading-6 text-slate-950">
                                    {productName}
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    Product ID
                                </p>

                                <p className="mt-1 truncate font-mono text-xs text-slate-700">
                                    {productId}
                                </p>

                                <div className="my-5 h-px bg-slate-100" />

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm text-slate-500">
                                            Status
                                        </span>

                                        <span className="text-sm font-medium capitalize text-slate-900">
                                            {status.replaceAll("_", " ")}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm text-slate-500">
                                            Placement
                                        </span>

                                        <span className="text-sm font-medium text-slate-900">
                                            {featured ? "Featured" : "Standard"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                                <div className="flex gap-3">
                                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-600" />

                                    <div>
                                        <p className="text-sm font-semibold text-blue-950">
                                            Admin moderation
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-blue-700">
                                            Changes made here immediately affect marketplace
                                            visibility.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Right actions */}
                        <section className="p-6 sm:p-7">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                    Product management
                                </p>

                                <h3 className="mt-1 text-lg font-semibold text-slate-950">
                                    General actions
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Update product information and marketplace placement.
                                </p>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <Link
                                    href={`/admin/products/${productId}/edit`}
                                    className="group relative flex min-h-[154px] flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                <FilePenLine className="size-5" />
                                            </div>

                                            <ArrowUpRight className="size-4 text-slate-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-600" />
                                        </div>

                                        <h4 className="mt-4 text-sm font-semibold text-slate-950">
                                            Edit product details
                                        </h4>

                                        <p className="mt-1.5 text-xs leading-5 text-slate-500">
                                            Update title, category, SKU, pricing and inventory
                                            settings.
                                        </p>
                                    </div>

                                    <span className="mt-4 text-xs font-semibold text-blue-600">
                                        Open editor
                                    </span>
                                </Link>

                                <ActionCard
                                    icon={featured ? StarOff : Sparkles}
                                    title={
                                        featured
                                            ? "Remove featured placement"
                                            : "Feature product"
                                    }
                                    description={
                                        canFeature || featured
                                            ? "Control featured placement across the homepage and marketplace."
                                            : "Product must be active, in stock and linked to an approved store."
                                    }
                                    label={featured ? "Remove featured" : "Feature product"}
                                    tone="violet"
                                    onClick={() =>
                                        runAction({
                                            action: "set_featured",
                                            featured: !featured,
                                        })
                                    }
                                    disabled={
                                        mutation.isPending ||
                                        (!featured && !canFeature)
                                    }
                                />
                            </div>

                            <div className="mt-8">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                    Catalog status
                                </p>

                                <h3 className="mt-1 text-lg font-semibold text-slate-950">
                                    Visibility controls
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Choose how this product should appear in the catalog.
                                </p>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {status !== "active" && (
                                    <ActionCard
                                        icon={CheckCircle2}
                                        title="Activate product"
                                        description={
                                            canActivate
                                                ? "Publish this product and make it available in the marketplace."
                                                : "Activation requires available stock and an approved store."
                                        }
                                        label="Set active"
                                        tone="emerald"
                                        onClick={() =>
                                            runAction({
                                                action: "set_status",
                                                status: "active",
                                            })
                                        }
                                        disabled={
                                            mutation.isPending || !canActivate
                                        }
                                    />
                                )}

                                {status !== "draft" && (
                                    <ActionCard
                                        icon={FilePenLine}
                                        title="Move to draft"
                                        description="Hide the product while keeping all information editable."
                                        label="Move to draft"
                                        tone="amber"
                                        onClick={() =>
                                            runAction({
                                                action: "set_status",
                                                status: "draft",
                                            })
                                        }
                                        disabled={mutation.isPending}
                                    />
                                )}

                                {status !== "out_of_stock" && (
                                    <ActionCard
                                        icon={CircleOff}
                                        title="Mark out of stock"
                                        description="Disable purchasing and automatically remove featured placement."
                                        label="Mark unavailable"
                                        tone="rose"
                                        onClick={() =>
                                            runAction({
                                                action: "set_status",
                                                status: "out_of_stock",
                                            })
                                        }
                                        disabled={mutation.isPending}
                                    />
                                )}
                            </div>

                            {status !== "archived" && (
                                <div className="mt-8">
                                    <div className="rounded-2xl border border-red-200 bg-red-50/40 p-4 sm:p-5">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex gap-3">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                                                    <Archive className="size-5" />
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-semibold text-red-950">
                                                        Archive product
                                                    </h4>

                                                    <p className="mt-1 max-w-lg text-xs leading-5 text-red-700">
                                                        Remove this listing from the active
                                                        catalog without deleting order
                                                        history or product records.
                                                    </p>
                                                </div>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="destructive"
                                                className="shrink-0 rounded-xl"
                                                onClick={() =>
                                                    runAction({
                                                        action: "set_status",
                                                        status: "archived",
                                                    })
                                                }
                                                disabled={mutation.isPending}
                                            >
                                                <Archive className="size-4" />
                                                Archive
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="flex-row items-center justify-between gap-3 border-t bg-white px-6 py-4 sm:px-8">
                        <div className="min-w-0">
                            {mutation.isPending ? (
                                <span className="flex items-center gap-2 text-sm text-slate-500">
                                    <Loader2 className="size-4 animate-spin" />
                                    Updating product...
                                </span>
                            ) : (
                                <span className="hidden text-xs text-slate-400 sm:block">
                                    Product changes apply immediately.
                                </span>
                            )}
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl px-5"
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
    icon: LucideIcon;
    title: string;
    description: string;
    label: string;
    tone?: "slate" | "blue" | "violet" | "emerald" | "amber" | "rose";
    disabled?: boolean;
    onClick: () => void;
};

const toneStyles = {
    slate: {
        icon: "bg-slate-100 text-slate-700",
        button:
            "border-slate-200 text-slate-700 hover:bg-slate-950 hover:text-white",
        border: "hover:border-slate-300",
    },
    blue: {
        icon: "bg-blue-50 text-blue-600",
        button:
            "border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white",
        border: "hover:border-blue-200",
    },
    violet: {
        icon: "bg-violet-50 text-violet-600",
        button:
            "border-violet-200 text-violet-700 hover:bg-violet-600 hover:text-white",
        border: "hover:border-violet-200",
    },
    emerald: {
        icon: "bg-emerald-50 text-emerald-600",
        button:
            "border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white",
        border: "hover:border-emerald-200",
    },
    amber: {
        icon: "bg-amber-50 text-amber-600",
        button:
            "border-amber-200 text-amber-700 hover:bg-amber-500 hover:text-white",
        border: "hover:border-amber-200",
    },
    rose: {
        icon: "bg-rose-50 text-rose-600",
        button:
            "border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white",
        border: "hover:border-rose-200",
    },
};

function ActionCard({
    icon: Icon,
    title,
    description,
    label,
    tone = "slate",
    disabled = false,
    onClick,
}: ActionCardProps) {
    const styles = toneStyles[tone];

    return (
        <div
            className={cn(
                "flex min-h-[154px] flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200",
                !disabled &&
                "hover:-translate-y-0.5 hover:shadow-md",
                !disabled && styles.border,
                disabled && "cursor-not-allowed opacity-55",
            )}
        >
            <div>
                <div
                    className={cn(
                        "flex size-10 items-center justify-center rounded-xl",
                        styles.icon,
                    )}
                >
                    <Icon className="size-5" />
                </div>

                <h4 className="mt-4 text-sm font-semibold text-slate-950">
                    {title}
                </h4>

                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                    {description}
                </p>
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn(
                    "mt-4 w-fit rounded-lg transition-colors",
                    styles.button,
                )}
                onClick={onClick}
                disabled={disabled}
            >
                {label}
            </Button>
        </div>
    );
}
