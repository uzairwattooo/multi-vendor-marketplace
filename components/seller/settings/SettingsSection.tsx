import type { LucideIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type SettingsSectionProps = {
    icon: LucideIcon;
    title: string;
    description: string;
    children: React.ReactNode;
    className?: string;
};

export function SettingsSection({
    icon: Icon,
    title,
    description,
    children,
    className,
}: SettingsSectionProps) {
    return (
        <section
            className={cn(
                "overflow-hidden rounded-2xl border bg-card shadow-sm",
                className,
            )}
        >
            <div className="border-b bg-muted/25 px-5 py-5 sm:px-7">
                <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold tracking-tight">
                            {title}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-5 sm:p-7">{children}</div>
        </section>
    );
}

type FormFieldProps = {
    label: string;
    htmlFor: string;
    error?: string;
    hint?: string;
    children: React.ReactNode;
    className?: string;
};

export function FormField({
    label,
    htmlFor,
    error,
    hint,
    children,
    className,
}: FormFieldProps) {
    return (
        <div className={cn("space-y-2", className)}>
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}

            {error ? (
                <p className="text-sm text-destructive">{error}</p>
            ) : hint ? (
                <p className="text-xs leading-5 text-muted-foreground">
                    {hint}
                </p>
            ) : null}
        </div>
    );
}

export const nativeSelectClassName =
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";
