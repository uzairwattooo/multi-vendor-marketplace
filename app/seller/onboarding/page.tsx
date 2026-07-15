import { eq } from "drizzle-orm";
import {
    ArrowLeft,
    CheckCircle2,
    Store,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import Container from "@/components/common/Container";
import StoreOnboardingForm from "@/components/seller/StoreOnboardingForm";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/db";
import { store } from "@/db/schema";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default async function SellerOnboardingPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login?callbackURL=/seller/onboarding");
    }

    const [existingStore] = await db
        .select({
            id: store.id,
            name: store.name,
            slug: store.slug,
            status: store.status,
        })
        .from(store)
        .where(eq(store.ownerId, session.user.id))
        .limit(1);

    if (existingStore) {
        return (
            <main className="min-h-screen bg-muted/30 py-12 sm:py-20">
                <Container>
                    <div className="mx-auto max-w-2xl rounded-3xl border bg-card p-8 text-center shadow-sm sm:p-12">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <CheckCircle2 className="size-8" />
                        </div>

                        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                            Application submitted
                        </p>

                        <h1 className="mt-3 text-3xl font-bold tracking-tight">
                            {existingStore.name}
                        </h1>

                        <p className="mt-4 text-muted-foreground">
                            Your store application is currently{" "}
                            <span className="font-semibold capitalize text-foreground">
                                {existingStore.status}
                            </span>
                            .
                        </p>

                        <Link
                            href="/"
                            className={cn(
                                buttonVariants({
                                    variant: "outline",
                                    size: "lg",
                                }),
                                "mt-8",
                            )}
                        >
                            <ArrowLeft className="size-4" />
                            Back to marketplace
                        </Link>
                    </div>
                </Container>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-muted/30 py-10 sm:py-16">
            <Container>
                <div className="mx-auto max-w-5xl">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        Back to marketplace
                    </Link>

                    <div className="mt-8 rounded-[32px] border bg-gradient-to-br from-primary/10 via-card to-card p-7 sm:p-10">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                            <Store className="size-7" />
                        </div>

                        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                            Seller onboarding
                        </p>

                        <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            Create your store and start building your business
                        </h1>

                        <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
                            Complete the information below. Your application will
                            be reviewed before your store becomes active.
                        </p>
                    </div>

                    <div className="mt-8">
                        <StoreOnboardingForm
                            defaultEmail={session.user.email}
                        />
                    </div>
                </div>
            </Container>
        </main>
    );
}