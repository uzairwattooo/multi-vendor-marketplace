"use server";

import { headers } from "next/headers";
import { and, desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { userAddress } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function getAddresses() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        const addresses = await db.query.userAddress.findMany({
            where: eq(userAddress.userId, session.user.id),
            orderBy: [
                desc(userAddress.isDefault),
                desc(userAddress.createdAt),
            ],
        });

        return addresses;
    } catch (error) {
        console.error("GET_ADDRESSES_ERROR:", error);
        throw new Error("Failed to load addresses.");
    }
}
export async function getAddress(id: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        const address = await db.query.userAddress.findFirst({
            where: and(
                eq(userAddress.id, id),
                eq(userAddress.userId, session.user.id),
            ),
        });

        if (!address) {
            throw new Error("Address not found.");
        }

        return address;
    } catch (error) {
        console.error("GET_ADDRESS_ERROR:", error);
        throw new Error("Failed to load address.");
    }
}
export async function createAddress(
    data: {
        fullName: string;
        phone: string;
        address: string;
        apartment?: string;
        city: string;
        state: string;
        postalCode?: string;
        country: string;
        isDefault?: boolean;
    },
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        const existingAddresses =
            await db.query.userAddress.findMany({
                where: eq(
                    userAddress.userId,
                    session.user.id,
                ),
            });

        const makeDefault =
            existingAddresses.length === 0 ||
            data.isDefault === true;

        if (makeDefault) {
            await db
                .update(userAddress)
                .set({
                    isDefault: false,
                })
                .where(
                    eq(
                        userAddress.userId,
                        session.user.id,
                    ),
                );
        }

        await db.insert(userAddress).values({
            userId: session.user.id,
            fullName: data.fullName,
            phone: data.phone,
            address: data.address,
            apartment: data.apartment,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            country: data.country || "Pakistan",
            isDefault: makeDefault,
        });

        revalidatePath("/dashboard/addresses");

        return {
            success: true,
            message: "Address created successfully.",
        };
    } catch (error) {
        console.error(
            "CREATE_ADDRESS_ERROR:",
            error,
        );

        throw new Error(
            "Failed to create address.",
        );
    }
}
export async function updateAddress(
    id: string,
    data: {
        fullName: string;
        phone: string;
        address: string;
        apartment?: string;
        city: string;
        state: string;
        postalCode?: string;
        country: string;
        isDefault?: boolean;
    },
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        const existing =
            await db.query.userAddress.findFirst({
                where: and(
                    eq(userAddress.id, id),
                    eq(
                        userAddress.userId,
                        session.user.id,
                    ),
                ),
            });

        if (!existing) {
            throw new Error(
                "Address not found.",
            );
        }

        if (data.isDefault) {
            await db
                .update(userAddress)
                .set({
                    isDefault: false,
                })
                .where(
                    eq(
                        userAddress.userId,
                        session.user.id,
                    ),
                );
        }

        await db
            .update(userAddress)
            .set({
                fullName: data.fullName,
                phone: data.phone,
                address: data.address,
                apartment: data.apartment,
                city: data.city,
                state: data.state,
                postalCode: data.postalCode,
                country: data.country,
                isDefault:
                    data.isDefault ??
                    existing.isDefault,
            })
            .where(eq(userAddress.id, id));

        revalidatePath("/dashboard/addresses");

        return {
            success: true,
            message: "Address updated successfully.",
        };
    } catch (error) {
        console.error(
            "UPDATE_ADDRESS_ERROR:",
            error,
        );

        throw new Error(
            "Failed to update address.",
        );
    }
}
export async function deleteAddress(id: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        const address = await db.query.userAddress.findFirst({
            where: and(
                eq(userAddress.id, id),
                eq(userAddress.userId, session.user.id),
            ),
        });

        if (!address) {
            throw new Error("Address not found.");
        }

        await db
            .delete(userAddress)
            .where(eq(userAddress.id, id));

        // Agar deleted address default tha
        if (address.isDefault) {
            const nextAddress =
                await db.query.userAddress.findFirst({
                    where: eq(
                        userAddress.userId,
                        session.user.id,
                    ),
                    orderBy: [
                        desc(userAddress.createdAt),
                    ],
                });

            if (nextAddress) {
                await db
                    .update(userAddress)
                    .set({
                        isDefault: true,
                    })
                    .where(
                        eq(
                            userAddress.id,
                            nextAddress.id,
                        ),
                    );
            }
        }

        revalidatePath("/dashboard/addresses");

        return {
            success: true,
            message: "Address deleted successfully.",
        };
    } catch (error) {
        console.error(
            "DELETE_ADDRESS_ERROR:",
            error,
        );

        throw new Error(
            "Failed to delete address.",
        );
    }
}
export async function setDefaultAddress(
    id: string,
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        const address =
            await db.query.userAddress.findFirst({
                where: and(
                    eq(userAddress.id, id),
                    eq(
                        userAddress.userId,
                        session.user.id,
                    ),
                ),
            });

        if (!address) {
            throw new Error(
                "Address not found.",
            );
        }

        await db
            .update(userAddress)
            .set({
                isDefault: false,
            })
            .where(
                eq(
                    userAddress.userId,
                    session.user.id,
                ),
            );

        await db
            .update(userAddress)
            .set({
                isDefault: true,
            })
            .where(eq(userAddress.id, id));

        revalidatePath("/dashboard/addresses");

        return {
            success: true,
            message:
                "Default address updated successfully.",
        };
    } catch (error) {
        console.error(
            "SET_DEFAULT_ADDRESS_ERROR:",
            error,
        );

        throw new Error(
            "Failed to update default address.",
        );
    }
}