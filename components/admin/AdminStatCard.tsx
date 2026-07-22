import type { LucideIcon } from "lucide-react";

type AdminStatCardProps = {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
    accent?: "primary" | "success" | "warning" | "danger" | "blue";
};

const accentClasses = {
    primary: "bg-primary/10 text-primary",
    success:
        "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    warning:
        "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    danger: "bg-destructive/10 text-destructive",
    blue: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
};

export default function AdminStatCard({
    title,
    value,
    description,
    icon: Icon,
    accent = "primary",
}: AdminStatCardProps) {
    return (
        <article className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>

                    <p className="mt-3 truncate text-2xl font-bold tracking-tight">
                        {value}
                    </p>
                </div>

                <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${accentClasses[accent]}`}
                >
                    <Icon className="size-5" />
                </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {description}
            </p>
        </article>
    );
}
