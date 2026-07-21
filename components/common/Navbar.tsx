import { headers } from "next/headers";
import { getWishlistCount } from "@/lib/wishlist/get-wishlist-count";
import { auth } from "@/lib/auth";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const wishlistCount = await getWishlistCount();
    return (
        <NavbarClient
            wishlistCount={wishlistCount}
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