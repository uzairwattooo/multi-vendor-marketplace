import {
    ArrowRight,
    CheckCircle2,
    Clock3,
} from "lucide-react";
import Link from "next/link";

import Container from "@/components/common/Container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function StoreApplicationSuccessPage() {
    return (
        <main className="flex min-h-screen items-center bg-muted/30 py-12">
            <Container>
                <div className="mx-auto max-w-2xl rounded-[32px] border bg-card p-8 text-center shadow-sm sm:p-12">
                    <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <CheckCircle2 className="size-10" />
                    </div>

                    <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                        Application received
                    </p>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                        Your store application has been submitted
                    </h1>

                    <p className="mx-auto mt-5 max-w-xl leading-7 text-muted-foreground">
                        An administrator will review your information. You will
                        receive access to the seller dashboard after approval.
                    </p>

                    <div className="mt-8 flex items-center justify-center gap-3 rounded-2xl bg-muted p-4">
                        <Clock3 className="size-5 text-primary" />

                        <p className="text-sm font-medium">
                            Current status: Pending review
                        </p>
                    </div>

                    <Link
                        href="/"
                        className={cn(
                            buttonVariants({
                                size: "lg",
                            }),
                            "mt-8 gap-2",
                        )}
                    >
                        Return to marketplace
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
            </Container>
        </main>
    );
}