import {
    and,
    eq,
    inArray,
} from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
    order,
    orderItem,
    payment,
    product,
    shippingAddress,
    store,
} from "@/db/schema";
import { validateCsrf } from "@/lib/security/csrf";
import { createOrderSchema } from "@/lib/validations/order";

type ProductRow = {
    id: string;
    name: string;
    sku: string;
    storeId: string;
    storeName: string;
    price: string | number;
    salePrice: string | number | null;
    stock: number;
    status: string;
};

function createOrderNumber(): string {
    return `ORD-${Date.now()}-${crypto
        .randomUUID()
        .slice(0, 6)
        .toUpperCase()}`;
}

export async function POST(request: Request) {
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
                {
                    message:
                        "Please login before placing an order",
                },
                {
                    status: 401,
                },
            );
        }

        const body: unknown = await request.json();

        const result =
            createOrderSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    message:
                        "Please check your order information",
                    errors:
                        result.error.flatten().fieldErrors,
                },
                {
                    status: 400,
                },
            );
        }

        const requestedItems = result.data.items;

        const uniqueProductIds = [
            ...new Set(
                requestedItems.map(
                    (item) => item.productId,
                ),
            ),
        ];

        if (
            uniqueProductIds.length !==
            requestedItems.length
        ) {
            return NextResponse.json(
                {
                    message:
                        "Duplicate products found in cart",
                },
                {
                    status: 400,
                },
            );
        }

        const productRows: ProductRow[] = await db
            .select({
                id: product.id,
                name: product.name,
                sku: product.sku,
                storeId: store.id,
                storeName: store.name,
                price: product.price,
                salePrice: product.salePrice,
                stock: product.stock,
                status: product.status,
            })
            .from(product)
            .innerJoin(
                store,
                eq(product.storeId, store.id),
            )
            .where(
                and(
                    inArray(
                        product.id,
                        uniqueProductIds,
                    ),
                    eq(product.status, "active"),
                    eq(store.status, "approved"),
                ),
            );

        if (
            productRows.length !==
            uniqueProductIds.length
        ) {
            return NextResponse.json(
                {
                    message:
                        "One or more products are unavailable",
                },
                {
                    status: 400,
                },
            );
        }

        const quantityMap = new Map<
            string,
            number
        >(
            requestedItems.map((item) => [
                item.productId,
                item.quantity,
            ]),
        );

        for (const currentProduct of productRows) {
            const requestedQuantity =
                quantityMap.get(currentProduct.id) ?? 0;

            if (
                requestedQuantity >
                currentProduct.stock
            ) {
                return NextResponse.json(
                    {
                        message: `${currentProduct.name} only has ${currentProduct.stock} items available`,
                    },
                    {
                        status: 409,
                    },
                );
            }
        }

        const productsByStore = new Map<
            string,
            ProductRow[]
        >();

        for (const currentProduct of productRows) {
            const existing =
                productsByStore.get(
                    currentProduct.storeId,
                ) ?? [];

            existing.push(currentProduct);

            productsByStore.set(
                currentProduct.storeId,
                existing,
            );
        }

        const createdOrders = await db.transaction(
            async (tx) => {
                const orderResults: {
                    id: string;
                    orderNumber: string;
                }[] = [];

                for (const [
                    storeId,
                    storeProducts,
                ] of productsByStore) {
                    const subtotal =
                        storeProducts.reduce(
                            (total, currentProduct) => {
                                const quantity =
                                    quantityMap.get(
                                        currentProduct.id,
                                    ) ?? 0;

                                const unitPrice = Number(
                                    currentProduct.salePrice ??
                                    currentProduct.price,
                                );

                                return (
                                    total +
                                    unitPrice * quantity
                                );
                            },
                            0,
                        );

                    const shippingAmount = 250;
                    const taxAmount = 0;
                    const discountAmount = 0;

                    const totalAmount =
                        subtotal +
                        shippingAmount +
                        taxAmount -
                        discountAmount;

                    const orderNumber =
                        createOrderNumber();

                    const [createdOrder] = await tx
                        .insert(order)
                        .values({
                            orderNumber,
                            buyerId: session.user.id,
                            storeId,

                            status: "pending",
                            paymentStatus: "pending",

                            subtotal: String(subtotal),
                            shippingAmount:
                                String(shippingAmount),
                            taxAmount:
                                String(taxAmount),
                            discountAmount:
                                String(discountAmount),
                            totalAmount:
                                String(totalAmount),

                            customerNote:
                                result.data
                                    .customerNote ?? null,
                        })
                        .returning({
                            id: order.id,
                            orderNumber:
                                order.orderNumber,
                        });

                    await tx
                        .insert(orderItem)
                        .values(
                            storeProducts.map(
                                (currentProduct) => {
                                    const quantity =
                                        quantityMap.get(
                                            currentProduct.id,
                                        ) ?? 0;

                                    const unitPrice =
                                        Number(
                                            currentProduct.salePrice ??
                                            currentProduct.price,
                                        );

                                    return {
                                        orderId:
                                            createdOrder.id,
                                        productId:
                                            currentProduct.id,
                                        productName:
                                            currentProduct.name,
                                        sku: currentProduct.sku,
                                        unitPrice:
                                            String(unitPrice),
                                        quantity,
                                        totalPrice: String(
                                            unitPrice *
                                            quantity,
                                        ),
                                    };
                                },
                            ),
                        );

                    await tx
                        .insert(shippingAddress)
                        .values({
                            orderId: createdOrder.id,
                            fullName:
                                result.data
                                    .shippingAddress
                                    .fullName,
                            phone:
                                result.data
                                    .shippingAddress.phone,
                            address:
                                result.data
                                    .shippingAddress
                                    .address,
                            city:
                                result.data
                                    .shippingAddress.city,
                            state:
                                result.data
                                    .shippingAddress.state,
                            postalCode:
                                result.data
                                    .shippingAddress
                                    .postalCode ?? null,
                            country:
                                result.data
                                    .shippingAddress
                                    .country,
                        });

                    await tx.insert(payment).values({
                        orderId: createdOrder.id,
                        provider: "cod",
                        amount: String(totalAmount),
                        platformFee: "0",
                        sellerAmount:
                            String(totalAmount),
                        status: "pending",
                    });

                    for (const currentProduct of storeProducts) {
                        const quantity =
                            quantityMap.get(
                                currentProduct.id,
                            ) ?? 0;

                        await tx
                            .update(product)
                            .set({
                                stock:
                                    currentProduct.stock -
                                    quantity,
                                updatedAt: new Date(),
                            })
                            .where(
                                and(
                                    eq(
                                        product.id,
                                        currentProduct.id,
                                    ),
                                    eq(
                                        product.storeId,
                                        storeId,
                                    ),
                                ),
                            );
                    }

                    orderResults.push(createdOrder);
                }

                return orderResults;
            },
        );

        return NextResponse.json(
            {
                message:
                    "Order placed successfully",
                orderId: createdOrders[0]?.id,
                orders: createdOrders,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error(
            "CREATE_ORDER_ERROR:",
            error,
        );

        return NextResponse.json(
            {
                message: "Unable to place order",
            },
            {
                status: 500,
            },
        );
    }
}