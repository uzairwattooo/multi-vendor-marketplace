import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export async function getCurrentSession() {
    return auth.api.getSession({
        headers: await headers(),
    });
}

export async function requireUser() {
    const session = await getCurrentSession();

    if (!session?.user) {
        redirect("/login");
    }

    return session;
}

export async function requireSeller() {
    const session = await requireUser();

    if (session.user.role !== "seller") {
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

export async function requireGuest() {
    const session = await getCurrentSession();

    if (!session?.user) {
        return;
    }

    if (session.user.role === "admin") {
        redirect("/admin");
    }

    if (session.user.role === "seller") {
        redirect("/seller/dashboard");
    }

    redirect("/");
}