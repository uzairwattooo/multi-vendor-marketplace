import { headers } from "next/headers";
import { count, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { wishlist } from "@/db/schema";

import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let wishlistCount = 0;

  if (session?.user?.id) {
    const [wishlistResult] = await db
      .select({
        total: count(),
      })
      .from(wishlist)
      .where(
        eq(
          wishlist.userId,
          session.user.id,
        ),
      );

    wishlistCount = Number(
      wishlistResult?.total ?? 0,
    );
  }

  const user = session?.user
    ? {
      name:
        session.user.name ??
        "User",
      role:
        session.user.role ??
        null,
    }
    : null;

  return (
    <NavbarClient
      user={user}
      wishlistCount={wishlistCount}
    />
  );
}