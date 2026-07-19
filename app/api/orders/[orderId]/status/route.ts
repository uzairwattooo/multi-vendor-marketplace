import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { order, store } from "@/db/schema";
import { validateCsrf } from "@/lib/security/csrf";

type RouteContext = {
    params: Promise<{
        orderId: string;
    }>;
};

export async function PATCH(
    request: Request,
    { params }: RouteContext,
) {
    const csrfCheck = validateCsrf(request);

    if (!csrfCheck.success) {
        return csrfCheck.response;
    }

    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { message: "Authentication required" },
                { status: 401 },
            );
        }

        if (session.user.role !== "seller") {
            return NextResponse.json(
                { message: "Seller access required" },
                { status: 403 },
            );
        }

        const { orderId } = await params;

        const body = await request.json();

        const status = body.status as
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "refunded";

        const validStatuses = [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
            "refunded",
        ];

        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { message: "Invalid order status" },
                { status: 400 },
            );
        }

        const [sellerStore] = await db
            .select({
                id: store.id,
            })
            .from(store)
            .where(
                and(
                    eq(store.ownerId, session.user.id),
                    eq(store.status, "approved"),
                ),
            )
            .limit(1);

        if (!sellerStore) {
            return NextResponse.json(
                { message: "Store not found" },
                { status: 404 },
            );
        }

        const [existingOrder] = await db
            .select({
                id: order.id,
            })
            .from(order)
            .where(
                and(
                    eq(order.id, orderId),
                    eq(order.storeId, sellerStore.id),
                ),
            )
            .limit(1);

        if (!existingOrder) {
            return NextResponse.json(
                { message: "Order not found" },
                { status: 404 },
            );
        }

        await db
            .update(order)
            .set({
                status,
            })
            .where(eq(order.id, orderId));

        return NextResponse.json({
            message: "Order status updated successfully",
        });
    } catch (error) {
        console.error("UPDATE_ORDER_STATUS_ERROR:", error);

        return NextResponse.json(
            {
                message: "Unable to update order status",
            },
            {
                status: 500,
            },
        );
    }
}