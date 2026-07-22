import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminPaginationProps = {
    page: number;
    pageCount: number;
    total: number;
    pathname: string;
    searchParams: Record<string, string | undefined>;
};

function createPageHref(
    pathname: string,
    searchParams: Record<string, string | undefined>,
    page: number,
) {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
        if (value && key !== "page") {
            params.set(key, value);
        }
    });

    params.set("page", String(page));

    return `${pathname}?${params.toString()}`;
}

export default function AdminPagination({
    page,
    pageCount,
    total,
    pathname,
    searchParams,
}: AdminPaginationProps) {
    if (pageCount <= 1) {
        return (
            <p className="text-sm text-muted-foreground">
                {total.toLocaleString()} result{total === 1 ? "" : "s"}
            </p>
        );
    }

    const pages = Array.from(
        new Set(
            [1, page - 1, page, page + 1, pageCount].filter(
                (currentPage) =>
                    currentPage >= 1 && currentPage <= pageCount,
            ),
        ),
    ).sort((first, second) => first - second);

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
                Page {page} of {pageCount} · {total.toLocaleString()} results
            </p>

            <div className="flex flex-wrap items-center gap-2">
                <Link
                    href={createPageHref(
                        pathname,
                        searchParams,
                        Math.max(1, page - 1),
                    )}
                    aria-disabled={page <= 1}
                    className={cn(
                        buttonVariants({
                            variant: "outline",
                            size: "sm",
                        }),
                        "rounded-xl",
                        page <= 1 && "pointer-events-none opacity-50",
                    )}
                >
                    <ChevronLeft className="size-4" />
                    Previous
                </Link>

                {pages.map((currentPage, index) => {
                    const previousPage = pages[index - 1];
                    const showEllipsis =
                        previousPage !== undefined &&
                        currentPage - previousPage > 1;

                    return (
                        <span
                            key={currentPage}
                            className="contents"
                        >
                            {showEllipsis && (
                                <span className="px-1 text-muted-foreground">
                                    …
                                </span>
                            )}

                            <Link
                                href={createPageHref(
                                    pathname,
                                    searchParams,
                                    currentPage,
                                )}
                                className={cn(
                                    buttonVariants({
                                        variant:
                                            currentPage === page
                                                ? "default"
                                                : "outline",
                                        size: "icon-sm",
                                    }),
                                    "rounded-xl",
                                )}
                            >
                                {currentPage}
                            </Link>
                        </span>
                    );
                })}

                <Link
                    href={createPageHref(
                        pathname,
                        searchParams,
                        Math.min(pageCount, page + 1),
                    )}
                    aria-disabled={page >= pageCount}
                    className={cn(
                        buttonVariants({
                            variant: "outline",
                            size: "sm",
                        }),
                        "rounded-xl",
                        page >= pageCount &&
                            "pointer-events-none opacity-50",
                    )}
                >
                    Next
                    <ChevronRight className="size-4" />
                </Link>
            </div>
        </div>
    );
}
