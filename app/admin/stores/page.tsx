import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Container from "@/components/common/Container";
import PendingStoresTable from "@/components/admin/PendingStoresTable";
import { db } from "@/db";
import { store, user } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function AdminStoresPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login?callbackURL=/admin/stores");
    }

    if (session.user.role !== "admin") {
        redirect("/");
    }

    const pendingStores = await db
        .select({
            id: store.id,
            name: store.name,
            category: store.category,
            email: store.email,
            phone: store.phone,
            city: store.city,
            country: store.country,
            description: store.description,
            createdAt: store.createdAt,

            owner: {
                name: user.name,
                email: user.email,
            },
        })
        .from(store)
        .innerJoin(user, eq(store.ownerId, user.id))
        .where(eq(store.status, "pending"))
        .orderBy(desc(store.createdAt));

    return (
        <main className="min-h-screen bg-muted/30 py-10 sm:py-14">
            <Container>
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                            Admin moderation
                        </p>

                        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    Store applications
                                </h1>

                                <p className="mt-3 text-muted-foreground">
                                    Review pending seller stores before they
                                    become active.
                                </p>
                            </div>

                            <div className="rounded-xl border bg-card px-4 py-3 shadow-sm">
                                <p className="text-xs text-muted-foreground">
                                    Pending applications
                                </p>

                                <p className="mt-1 text-2xl font-bold">
                                    {pendingStores.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <PendingStoresTable stores={pendingStores} />
                </div>
            </Container>
        </main>
    );
}