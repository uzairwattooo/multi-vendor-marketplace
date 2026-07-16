import {
    and,
    desc,
    eq,
    sql,
} from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
    order,
    orderItem,
    shippingAddress,
    store,
    user,
} from "@/db/schema";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                {
                    message:
                        "Authentication required",
                },
                {
                    status: 401,
                },
            );
        }

        if (session.user.role !== "seller") {
            return NextResponse.json(
                {
                    message:
                        "Seller access required",
                },
                {
                    status: 403,
                },
            );
        }

        const [sellerStore] = await db
            .select({
                id: store.id,
            })
            .from(store)
            .where(
                and(
                    eq(
                        store.ownerId,
                        session.user.id,
                    ),
                    eq(store.status, "approved"),
                ),
            )
            .limit(1);

        if (!sellerStore) {
            return NextResponse.json(
                {
                    message:
                        "Approved store not found",
                },
                {
                    status: 404,
                },
            );
        }

        const orders = await db
            .select({
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                paymentStatus:
                    order.paymentStatus,
                totalAmount: order.totalAmount,
                createdAt: order.createdAt,

                customerName: user.name,
                customerEmail: user.email,

                shippingName:
                    shippingAddress.fullName,
                shippingPhone:
                    shippingAddress.phone,
                shippingCity:
                    shippingAddress.city,

                totalItems: sql<number>`
                    COALESCE(
                        SUM(${orderItem.quantity}),
                        0
                    )::int
                `,
            })
            .from(order)
            .innerJoin(
                user,
                eq(order.buyerId, user.id),
            )
            .leftJoin(
                shippingAddress,
                eq(
                    shippingAddress.orderId,
                    order.id,
                ),
            )
            .leftJoin(
                orderItem,
                eq(orderItem.orderId, order.id),
            )
            .where(
                eq(
                    order.storeId,
                    sellerStore.id,
                ),
            )
            .groupBy(
                order.id,
                user.id,
                shippingAddress.id,
            )
            .orderBy(desc(order.createdAt));

        return NextResponse.json(orders);
    } catch (error) {
        console.error(
            "GET_SELLER_ORDERS_ERROR:",
            error,
        );

        return NextResponse.json(
            {
                message:
                    "Unable to fetch orders",
            },
            {
                status: 500,
            },
        );
    }
}