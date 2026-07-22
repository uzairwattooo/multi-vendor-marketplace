import { cn } from "@/lib/utils";

type AdminStatusBadgeProps = {
    value: string;
    label?: string;
};

const statusClasses: Record<string, string> = {
    approved:
        "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400",
    active:
        "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400",
    paid:
        "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400",
    verified:
        "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400",
    pending:
        "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400",
    processing:
        "bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:text-blue-400",
    seller:
        "bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-400",
    admin:
        "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-400",
    buyer:
        "bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-400",
    rejected:
        "bg-destructive/10 text-destructive ring-destructive/20",
    suspended:
        "bg-destructive/10 text-destructive ring-destructive/20",
    banned:
        "bg-destructive/10 text-destructive ring-destructive/20",
    unverified:
        "bg-zinc-500/10 text-zinc-700 ring-zinc-500/20 dark:text-zinc-300",
};

export default function AdminStatusBadge({
    value,
    label,
}: AdminStatusBadgeProps) {
    const normalizedValue = value.trim().toLowerCase();

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ring-inset",
                statusClasses[normalizedValue] ??
                    "bg-muted text-muted-foreground ring-border",
            )}
        >
            {label ?? normalizedValue.replaceAll("_", " ")}
        </span>
    );
}
