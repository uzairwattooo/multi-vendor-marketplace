import {
    ArrowRight,
    Construction,
} from "lucide-react";

type AdminModulePlaceholderProps = {
    eyebrow: string;
    title: string;
    description: string;
    nextStep: string;
};

export default function AdminModulePlaceholder({
    eyebrow,
    title,
    description,
    nextStep,
}: AdminModulePlaceholderProps) {
    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    {eyebrow}
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    {title}
                </h1>

                <p className="mt-2 max-w-2xl text-muted-foreground">
                    {description}
                </p>
            </div>

            <div className="rounded-3xl border border-dashed bg-card p-8 shadow-sm sm:p-12">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Construction className="size-6" />
                </div>

                <h2 className="mt-6 text-xl font-semibold">
                    Module shell is ready
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
                    The admin navigation and protected route are active.
                    This module will receive its data table, filters,
                    details pages and admin actions in the next phase.
                </p>

                <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-muted px-4 py-3 text-sm font-medium">
                    <ArrowRight className="size-4 text-primary" />
                    {nextStep}
                </div>
            </div>
        </div>
    );
}
