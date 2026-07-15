import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export async function requireUser() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    return session;
}

export async function requireSeller() {
    const session = await requireUser();

    if (
        session.user.role !== "seller" &&
        session.user.role !== "admin"
    ) {
        redirect("/");
    }

    return session;
}

export async function requireAdmin() {
    const session = await requireUser();

    if (session.user.role !== "admin") {
        redirect("/");
    }

    return session;
}