import Link from "next/link";
import { ArrowRight } from "lucide-react";

type SectionHeadingProps = {
    eyebrow?: string;
    title: string;
    description?: string;
    href?: string;
    linkText?: string;
};

export default function SectionHeading({
    eyebrow,
    title,
    description,
    href,
    linkText = "View all",
}: SectionHeadingProps) {
    return (
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
                {eyebrow && (
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                        {eyebrow}
                    </p>
                )}

                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                    {title}
                </h2>

                {description && (
                    <p className="mt-3 max-w-2xl text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            {href && (
                <Link
                    href={href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
                >
                    {linkText}
                    <ArrowRight className="size-4" />
                </Link>
            )}
        </div>
    );
}