import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return (
        <NavbarClient
            user={
                session?.user
                    ? {
                        name: session.user.name,
                        role: session.user.role ?? null,
                    }
                    : null
            }
        />
    );
}